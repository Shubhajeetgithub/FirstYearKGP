use axum::{Router, routing::post};
use dotenvy::dotenv;
use sqlx::postgres::PgPoolOptions;
use std::env;

mod auth;
mod db;
mod handlers;
mod state;

use anyhow::Result;

use crate::{auth::jwt::JwtConfig, state::AppState};

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")?;
    let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    let jwt = JwtConfig::new(&secret);
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await?;

    let state = AppState { db: pool, jwt: jwt };

    let app = Router::new()
        .route("/register", post(handlers::auth::register))
        .route("/login", post(handlers::auth::login))
        .route("/logout", post(handlers::auth::logout))
        .route("/refresh", post(handlers::auth::refresh))
        .route("/me", axum::routing::get(handlers::auth::me))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;

    Ok(())
}
