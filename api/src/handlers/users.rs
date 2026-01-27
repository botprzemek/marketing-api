use axum::{Json, extract::State};
use surrealdb::engine::remote::ws::Client;
use surrealdb::Surreal;

use crate::models::User;

pub async fn list_users(
    State(database): State<Surreal<Client>>,
) -> Json<Vec<User>> {
  let users: Vec<User> = database
    .select("user")
    .await?;

  Json(users)
}
