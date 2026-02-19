mod adapter;

use adapter::net::Server;

#[tokio::main]
async fn main() {
    Server::run().await.expect("");
}
