pub mod server;

use router::Router;

use tokio::net::TcpListener;

pub fn serve() {
    let listener = TcpListener::bind("localhost:8080").await?;
    axum::serve(listener, router)
}
