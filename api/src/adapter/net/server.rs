use crate::adapter::net::Routes;

use std::{
    env::var, sync::Arc
};
use tokio::net::TcpListener;
use scylla::client::{
    session::Session,
    session_builder::SessionBuilder
};

#[derive(Clone)]
pub struct AppState {
    pub database: Arc<Session>
}

pub struct Server;

impl Server {
    pub async fn run() -> Result<(), Box<dyn std::error::Error>> {
        let host = var("SERVER_HOST").map_err(|_| "Missing environment variable SERVER_HOST")?;
        let port = var("SERVER_PORT").map_err(|_| "Missing environment variable SERVER_PORT")?;

        let addr = format!("{}:{}", host, port);

        let listener = TcpListener::bind(&addr).await?;
        
        let uri = var("SCYLLA_URI")
            .unwrap_or_else(|_| "127.0.0.1:9042".to_string());
        let session = SessionBuilder::new()
                        .known_node(uri)
                        .build()
                        .await?;

        let state: AppState = AppState {
            database: Arc::new(session)
        };

        let router = Routes::create(state);

        println!("Listening on http://{addr}");
        axum::serve(listener, router).await?;

        Ok(())
    }
}
