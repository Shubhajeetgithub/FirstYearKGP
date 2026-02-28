use axum::{
    Json,
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
};

use serde::{Deserialize, Serialize};

use crate::{auth::password::hash_password, db::models::UserResponse, state::AppState};

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub roll_no: String,
    pub name: String,
    pub nickname: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: &'static str,
}

pub enum RegisterError {
    InvalidInput,
    UserExists,
    Internal,
}

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
