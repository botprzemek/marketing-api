pub mod handlers;
pub mod middlewares;

use crate::adapter::config::Config;
use crate::adapter::net::handlers::GamesHandler;
use crate::adapter::repositories::GamesRepository;

use axum::Router;
use axum::routing::{delete, get, post, put};
use scylla::client::session_builder::SessionBuilder;
use std::sync::Arc;
use tokio::net::TcpListener;

use uuid::Uuid;

#[derive(Clone)]
pub struct AppState {
    pub games_repository: GamesRepository,
}

pub struct Server {
    app_state: AppState,
    config: Config,
}

impl Server {
    pub async fn new(config: Config) -> Result<Self, Box<dyn std::error::Error>> {
        let url = config.get_database_url();
        let session = Arc::new(SessionBuilder::new().known_node(url).build().await?);

        session
            .query_unpaged("DROP KEYSPACE IF EXISTS api", &[])
            .await?;

        session
            .query_unpaged(
                "CREATE KEYSPACE IF NOT EXISTS api WITH REPLICATION = \
                {'class' : 'NetworkTopologyStrategy', 'replication_factor' : 1}",
                &[],
            )
            .await?;

        session.use_keyspace("api", false).await?;

        session
            .query_unpaged(
                "CREATE TABLE IF NOT EXISTS games (
                    id          UUID        PRIMARY KEY,
                    created_at  TIMESTAMP,
                    updated_at  TIMESTAMP
                )",
                &[],
            )
            .await?;

        session
            .query_unpaged(
                "CREATE TABLE IF NOT EXISTS games (
                    id          UUID        PRIMARY KEY,
                    created_at  TIMESTAMP,
                    updated_at  TIMESTAMP
                )",
                &[],
            )
            .await?;

        let id = Uuid::now_v7();

        session
            .query_unpaged(
                "INSERT INTO games (id, created_at) VALUES (?, toTimestamp(now()))",
                (&id,),
            )
            .await?;

        let games_repository = GamesRepository::new(session.clone()).await;

        let app_state = AppState { games_repository };

        Ok(Server { config, app_state })
    }

    pub async fn run(self) -> Result<(), Box<dyn std::error::Error>> {
        let server_url = self.config.get_server_url();
        let listener = TcpListener::bind(&server_url).await?;

        let games_routes = Router::new()
            .route("/", get(GamesHandler::get))
            .route("/", post(GamesHandler::create))
            .route("/{id}", get(GamesHandler::get_by_id))
            .route("/{id}", put(GamesHandler::update_by_id))
            .route("/{id}", delete(GamesHandler::delete_by_id))
            .with_state(self.app_state);

        let routes = Router::new().nest("/games", games_routes);

        let router_v1 = Router::new().nest("/v1", routes);

        println!("Listening on http://{server_url}");
        axum::serve(listener, router_v1).await?;

        Ok(())
    }
}
