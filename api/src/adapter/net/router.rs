use crate::adapter::net::server::AppState;

use super::handlers::{
    game_get,
    game_create,
    game_get_by_id,
    game_update_by_id,
    game_delete_by_id
};

use axum::{
    routing::{get,post,put,delete},
    Router,
};

pub struct Routes;

impl Routes {
    pub fn create(state: AppState) -> Router {
        Router::new()
            .route("/game", get(game_get))
            .route("/game", post(game_create))
            .route("/game/{id}", get(game_get_by_id))
            .route("/game/{id}", put(    game_update_by_id,
))
            .route("/game/{id}", delete(game_delete_by_id))
            .with_state(state)
    }
}
