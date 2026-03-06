use axum::{
    Json,
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use axum_extra::extract::{
    CookieJar,
    cookie::{Cookie, SameSite},
};
use serde::{Deserialize, Serialize};
use sqlx::types::time::OffsetDateTime;
use time::Duration;

use crate::{
    auth::{
        extractor::AuthenticatedUser,
        jwt::JwtConfig,
        password::{hash_password, verify_password},
        refresh::{generate_refresh_token, hash_token},
    },
    db::models::UserResponse,
    state::AppState,
};

//
// ======================
// Request Models
// ======================
//

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub roll_no: String,
    pub name: String,
    pub nickname: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

//
// ======================
// Error Response
// ======================
//

#[derive(Serialize)]
struct ErrorResponse {
    error: &'static str,
}

pub enum RegisterError {
    InvalidInput,
    UserExists,
    Internal,
}

pub enum AuthError {
    InvalidCredentials,
    Internal,
}

//
// ======================
// Error → HTTP Mapping
// ======================
//

impl IntoResponse for RegisterError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            RegisterError::InvalidInput => (StatusCode::BAD_REQUEST, "invalid_input"),
            RegisterError::UserExists => (StatusCode::CONFLICT, "user_already_exists"),
            RegisterError::Internal => (StatusCode::INTERNAL_SERVER_ERROR, "internal_error"),
        };

        (status, Json(ErrorResponse { error: message })).into_response()
    }
}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AuthError::InvalidCredentials => (StatusCode::UNAUTHORIZED, "invalid_credentials"),
            AuthError::Internal => (StatusCode::INTERNAL_SERVER_ERROR, "internal_error"),
        };

        (status, Json(ErrorResponse { error: message })).into_response()
    }
}

//
// ======================
// Register
// ======================
//

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<impl IntoResponse, RegisterError> {
    let roll_no = payload.roll_no.trim().to_string();
    let name = payload.name.trim().to_string();
    let nickname = payload.nickname.trim().to_string();
    let email = payload.email.trim().to_lowercase();
    let password = payload.password;

    // Basic validation
    if roll_no.len() != 9 || password.len() < 8 {
        return Err(RegisterError::InvalidInput);
    }

    let password_hash = hash_password(&password);

    let result = sqlx::query_as!(
        UserResponse,
        r#"
        INSERT INTO users (roll_no, name, nickname, email, password_hash)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, roll_no, name, nickname, email
        "#,
        roll_no,
        name,
        nickname,
        email,
        password_hash
    )
    .fetch_one(&state.db)
    .await;

    match result {
        Ok(user) => Ok((StatusCode::CREATED, Json(user))),
        Err(e) => {
            if let sqlx::Error::Database(db_err) = &e {
                if db_err.constraint().is_some() {
                    return Err(RegisterError::UserExists);
                }
            }
            Err(RegisterError::Internal)
        }
    }
}

//
// ======================
// Login
// ======================
//

pub async fn login(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, AuthError> {
    let email = payload.email.trim().to_lowercase();

    let user = sqlx::query!(
        r#"
        SELECT id, password_hash
        FROM users
        WHERE email = $1 AND deleted_at IS NULL
        "#,
        email
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|_| AuthError::Internal)?;

    let user = match user {
        Some(u) => u,
        None => return Err(AuthError::InvalidCredentials),
    };

    if !verify_password(&payload.password, &user.password_hash) {
        return Err(AuthError::InvalidCredentials);
    }

    //
    // ===== Create Access Token =====
    //
    let access_token = state
        .jwt
        .create_access_token(user.id)
        .map_err(|_| AuthError::Internal)?;

    //
    // ===== Create Refresh Token =====
    //
    let refresh_token = generate_refresh_token().ok_or(AuthError::Internal)?;

    let refresh_hash = hash_token(&refresh_token);

    let expires_at = OffsetDateTime::now_utc() + Duration::days(7);

    sqlx::query!(
        r#"
        INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
        "#,
        user.id,
        refresh_hash,
        expires_at
    )
    .execute(&state.db)
    .await
    .map_err(|_| AuthError::Internal)?;

    // Cookies

    let access_cookie = Cookie::build(("access_token", access_token))
        .http_only(true)
        .secure(cfg!(not(debug_assertions))) // true in release
        .same_site(SameSite::Strict)
        .path("/")
        .max_age(Duration::minutes(15))
        .build();

    let refresh_cookie = Cookie::build(("refresh_token", refresh_token))
        .http_only(true)
        .secure(cfg!(not(debug_assertions)))
        .same_site(SameSite::Strict)
        .path("/")
        .max_age(Duration::days(7))
        .build();

    let jar = jar.add(access_cookie).add(refresh_cookie);

    Ok((jar, StatusCode::OK))
}

pub async fn refresh(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<impl IntoResponse, AuthError> {
    // Extract Refresh Token
    let refresh_cookie = jar
        .get("refresh_token")
        .ok_or(AuthError::InvalidCredentials)?;

    let refresh_token = refresh_cookie.value();
    let refresh_hash = hash_token(refresh_token);

    // Lookup Token In DB
    let token_row = sqlx::query!(
        r#"
        SELECT id, user_id, expires_at, revoked_at
        FROM refresh_tokens
        WHERE token_hash = $1
        "#,
        refresh_hash
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|_| AuthError::Internal)?;

    let token_row = match token_row {
        Some(t) => t,
        None => return Err(AuthError::InvalidCredentials),
    };

    // Check revoked
    if token_row.revoked_at.is_some() {
        return Err(AuthError::InvalidCredentials);
    }

    // Check expiration
    if token_row.expires_at < OffsetDateTime::now_utc() {
        return Err(AuthError::InvalidCredentials);
    }

    // Revoke Old Refresh Token
    sqlx::query!(
        r#"
        UPDATE refresh_tokens
        SET revoked_at = now()
        WHERE id = $1
        "#,
        token_row.id
    )
    .execute(&state.db)
    .await
    .map_err(|_| AuthError::Internal)?;

    // Issue New Tokens
    let new_access_token = state
        .jwt
        .create_access_token(token_row.user_id)
        .map_err(|_| AuthError::Internal)?;

    let new_refresh_token = generate_refresh_token().ok_or(AuthError::Internal)?;
    let new_refresh_hash = hash_token(&new_refresh_token);

    let new_expires_at = OffsetDateTime::now_utc() + Duration::days(7);

    sqlx::query!(
        r#"
        INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
        "#,
        token_row.user_id,
        new_refresh_hash,
        new_expires_at
    )
    .execute(&state.db)
    .await
    .map_err(|_| AuthError::Internal)?;

    // Set New Cookies
    let access_cookie = Cookie::build(("access_token", new_access_token))
        .http_only(true)
        .secure(cfg!(not(debug_assertions)))
        .same_site(SameSite::Strict)
        .path("/")
        .max_age(Duration::minutes(15))
        .build();

    let refresh_cookie = Cookie::build(("refresh_token", new_refresh_token))
        .http_only(true)
        .secure(cfg!(not(debug_assertions)))
        .same_site(SameSite::Strict)
        .path("/")
        .max_age(Duration::days(7))
        .build();

    let jar = jar.add(access_cookie).add(refresh_cookie);

    Ok((jar, StatusCode::OK))
}

//
// ======================
// Logout
// ======================
//

pub async fn logout(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<impl IntoResponse, AuthError> {
    // We try to revoke the refresh token if present
    if let Some(refresh_cookie) = jar.get("refresh_token") {
        let refresh_token = refresh_cookie.value();
        let refresh_hash = hash_token(refresh_token);

        // Mark it revoked in the database.
        // Ignore errors if the token isn't found or is invalid; we still want to clear the cookies.
        let _ = sqlx::query!(
            r#"
            UPDATE refresh_tokens
            SET revoked_at = now()
            WHERE token_hash = $1 AND revoked_at IS NULL
            "#,
            refresh_hash
        )
        .execute(&state.db)
        .await;
    }

    // Clear Cookies
    let access_cookie = Cookie::build(("access_token", ""))
        .http_only(true)
        .secure(cfg!(not(debug_assertions)))
        .same_site(SameSite::Strict)
        .path("/")
        .max_age(Duration::ZERO)
        .build();

    let refresh_cookie = Cookie::build(("refresh_token", ""))
        .http_only(true)
        .secure(cfg!(not(debug_assertions)))
        .same_site(SameSite::Strict)
        .path("/")
        .max_age(Duration::ZERO)
        .build();

    let jar = jar.add(access_cookie).add(refresh_cookie);

    Ok((jar, StatusCode::OK))
}

//
// ======================
// Current User Profile
// ======================
//

pub async fn me(
    State(state): State<AppState>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AuthError> {
    let user_row = sqlx::query_as!(
        UserResponse,
        r#"
        SELECT id, roll_no, name, nickname, email
        FROM users
        WHERE id = $1 AND deleted_at IS NULL
        "#,
        user.id
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|_| AuthError::Internal)?;

    match user_row {
        Some(u) => Ok(Json(u)),
        None => Err(AuthError::InvalidCredentials), // e.g. user was soft-deleted but token exists
    }
}
