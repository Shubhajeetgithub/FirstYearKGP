use crate::auth::jwt::JwtConfig;
use sqlx::PgPool;

use axum::extract::FromRef;

#[derive(Clone, axum::extract::FromRef)]
pub struct AppState {
    pub db: PgPool,
    pub jwt: JwtConfig,
}
