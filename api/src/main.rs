use axum::{
  Router,
  routing::get,
  Json,
};
use serde::Serialize;
use tower_http::cors::CorsLayer;

#[derive(Serialize)]
struct User {
  id: u32,
  email: String,
  first_name: String,
  last_name: String,
}

async fn handler() -> Json<User> {
  Json(User {
      id: 1,
      email: "john.doe@acme.com".to_string(),
      first_name: "John".to_string(),
      last_name: "Doe".to_string()
  })
}

#[tokio::main]
async fn main() {
  let app = Router::new()
    .route("/*", get(handler))
    .layer(CorsLayer::permissive());

  if let Ok(listener) = tokio::net::TcpListener::bind("0.0.0.0:3000").await {
    println!("Listening on http://0.0.0.0:3000");
    let _ = axum::serve(listener, app).await;
  }
}