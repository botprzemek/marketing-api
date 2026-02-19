use axum::{
    extract::{State,Path},
    http::{StatusCode},
    response::IntoResponse,
    Json,
};
use serde::{
    Serialize,
    Deserialize,
};
use futures::{StreamExt, TryFutureExt, TryStreamExt};
use uuid::Uuid;

use crate::adapter::net::server::AppState;

#[derive(Debug, Deserialize, Default)]
pub struct Params {
    id: Uuid,
}

#[derive(Debug, Deserialize)]
pub struct Body {
    id: Uuid
}

#[derive(Debug, Serialize)]
pub struct Response {
    id: String,
}

struct DBResult {
    a: u32,
}

pub async fn get(
    State(state): State<AppState>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let stmt = state
        .database
        .prepare("SELECT a FROM ks.extab")
        .await
        .map_err(internal_error)?;

    let rows = state
        .database
        .execute_unpaged(&stmt, &[])?;

    Ok(Json({}))
}

fn internal_error<E: std::fmt::Display>(err: E) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}

pub async fn create(
    State(_state): State<AppState>,
    Json(payload): Json<Body>
) -> impl IntoResponse {
    (
        StatusCode::CREATED, 
        Json(Response { id: payload.id.to_string() })
    )
}

pub async fn get_by_id(
    State(_state): State<AppState>,
    Path(Params { id }): Path<Params>
) -> impl IntoResponse {
    Json(Response { id: id.to_string() })
}

pub async fn update_by_id(
    State(_state): State<AppState>,
    Path(Params { id }): Path<Params>
) -> impl IntoResponse {
    Json(Response { id: id.to_string() })
}

pub async fn delete_by_id(
    State(_state): State<AppState>,
    Path(Params { id }): Path<Params>
) -> impl IntoResponse {
    Json(Response { id: id.to_string() })
}