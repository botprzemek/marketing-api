use std::env::{var};

use tokio::net::TcpListener;

use crate::adapter::net::Routes;

pub struct Server;

impl Server {
    pub async fn run() -> Result<(), Box<dyn std::error::Error>> {
        let host = var("SERVER_HOST")
            .map_err(|_| "Missing environment variable SERVER_HOST")?;
        let port = var("SERVER_PORT")
            .map_err(|_| "Missing environment variable SERVER_PORT")?;

        let addr = format!("{}:{}", host, port);

        let listener = TcpListener::bind(&addr).await?;
        let router = Routes::create();
        
        println!("Listening on http://{addr}");
        axum::serve(listener, router).await?;

        Ok(())
    }
}
