use axum::Router;
use tower_http::cors::CorsLayer;

// mod database;
// mod models;
// mod handlers;

#[tokio::main]
async fn main() {
  let app = Router::new()
    .layer(CorsLayer::permissive());

  if let Ok(listener) = tokio::net::TcpListener::bind("0.0.0.0:3000").await {
    println!("Listening on http://0.0.0.0:3000");
    let _ = axum::serve(listener, app).await;
  }
}

//   if let Ok(database) = database::connect().await {
//       .route("/users", get(handlers::users::list_users))
//       .with_state(database)

// use std::sync::LazyLock;
// use std::time::Duration;
// use surrealdb::engine::remote::ws::{Client, Ws, Wss};
// use surrealdb::opt::Config;
// use surrealdb::Surreal;

// static DB: LazyLock<Surreal<Client>> = LazyLock::new(Surreal::init);

// #[tokio::main]
// async fn main() -> surrealdb::Result<()> {
//     let config = Config::default().query_timeout(Duration::from_millis(5000));
//     DB.connect::<Ws>(("database:8000", config)).await?;
//     Ok(())
// }