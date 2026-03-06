use axum::{
    extract::{FromRef, FromRequestParts},
    http::{StatusCode, request::Parts},
};
use axum_extra::extract::CookieJar;
use uuid::Uuid;

use crate::state::AppState;

pub struct AuthenticatedUser {
    pub id: Uuid,
}

impl<S> FromRequestParts<S> for AuthenticatedUser
where
    AppState: axum::extract::FromRef<S>,
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let app_state = AppState::from_ref(state);

        // 1. First, check cookies for the token
        let jar = CookieJar::from_headers(&parts.headers);

        let token = if let Some(cookie) = jar.get("access_token") {
            cookie.value().to_string()
        } else {
            // 2. Fallback to Authorization: Bearer <token>
            let auth_header = parts
                .headers
                .get(axum::http::header::AUTHORIZATION)
                .and_then(|h| h.to_str().ok())
                .and_then(|h| h.strip_prefix("Bearer "));

            match auth_header {
                Some(t) => t.to_string(),
                None => return Err(StatusCode::UNAUTHORIZED),
            }
        };

        // 3. Verify token
        match app_state.jwt.verify(&token) {
            Ok(claims) => Ok(AuthenticatedUser { id: claims.sub }),
            Err(_) => Err(StatusCode::UNAUTHORIZED),
        }
    }
}
