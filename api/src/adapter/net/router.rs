use axum::Router;
use axum::routing::{get};

pub struct Routes;

impl Routes {
    pub fn create() -> Router {
        Router::new()
            .route("/", get(|| async { "goodbye!" }))
    }
}
    // .route("/", get(routes::paths))
    // .route("/person/{id}", post(routes::create_person))
    // .route("/person/{id}", get(routes::read_person))
    // .route("/person/{id}", put(routes::update_person))
    // .route("/person/{id}", delete(routes::delete_person))
    // .route("/people", get(routes::list_people))
    // .route("/session", get(routes::session))
    // .route("/new_user", get(routes::make_new_user))
    // .route("/new_token", get(routes::get_new_token));
