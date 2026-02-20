pub mod handlers;
pub mod middlewares;

use crate::adapter::config::Config;
use crate::adapter::net::handlers::GamesHandler;
use crate::adapter::repositories::GamesRepository;

use std::sync::Arc;
use axum::Router;
use axum::routing::{get,post,put,delete};
use tokio::net::TcpListener;
use scylla::client::session_builder::SessionBuilder;

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
        let session = Arc::new(SessionBuilder::new()
            .known_node(url)
            .build()
            .await?);
        
        let games_repository = GamesRepository::new(session.clone()).await;
        
        let app_state = AppState { games_repository };

        Ok(Server {
            config,
            app_state
        })
    }

    pub async fn run(self) -> Result<(), Box<dyn std::error::Error>> {
        let server_url = self.config.get_server_url();
        let listener = TcpListener::bind(&server_url).await?;

        let router = Router::new()
            .route("/games", get(GamesHandler::get))
            .route("/games", post(GamesHandler::create))
            .route("/games/{id}", get(GamesHandler::get_by_id))
            .route("/games/{id}", put(GamesHandler::update_by_id))
            .route("/games/{id}", delete(GamesHandler::delete_by_id))
            .with_state(self.app_state);

        println!("Listening on http://{server_url}");
        axum::serve(listener, router).await?;

        Ok(())
    }
}

