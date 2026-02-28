use axum::{Router, routing::post};
use dotenvy::dotenv;
use sqlx::postgres::PgPoolOptions;
use std::env;

mod state;
mod auth {
    pub mod password;
}

mod db {
    pub mod models;
}

mod handlers {
    pub mod auth;
}
use anyhow::Result;

use state::AppState;

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")?;
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await?;

    let state = AppState { db: pool };

    let app = Router::new()
        .route("/register", post(handlers::auth::register))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;

    Ok(())
}
