mod adapter;

use adapter::config::Config;
use adapter::net::Server;

#[tokio::main]
async fn main() {
    let config = Config::load()
        .expect("Failed to load the configuration");

    Server::new(config)
        .await
        .expect("Failed to initialize the HTTP Server")
        .run()
        .await
        .expect("Failed to run the HTTP Server");
}
