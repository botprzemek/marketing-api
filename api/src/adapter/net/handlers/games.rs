use axum::{
    Json, extract::{Path, State}, http::StatusCode, response::IntoResponse
};
use serde::{
    Serialize,
    Deserialize,
};
use uuid::Uuid;

use crate::adapter::net::AppState;

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

fn internal_error<E: std::fmt::Display>(err: E) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}

pub struct GamesHandler {}

impl GamesHandler {
    pub async fn get(
        State(state): State<AppState>,
    ) -> Result<impl IntoResponse, (StatusCode, String)> {
        let result = state.games_repository
            .select_games()
            .await
            .map_err(internal_error)?;

        Ok((
            StatusCode::OK,
            Json(result)
        ))
    }

    pub async fn create(
        State(_state): State<AppState>,
        Json(payload): Json<Body>
    ) -> Result<impl IntoResponse, (StatusCode, String)> {
        Ok((
            StatusCode::CREATED, 
            Json(Response { id: payload.id.to_string() })
        ))
    }

    pub async fn get_by_id(
        State(_state): State<AppState>,
        Path(Params { id }): Path<Params>
    ) -> Result<impl IntoResponse, (StatusCode, String)> {
        Ok((
            StatusCode::OK,
            Json(Response { id: id.to_string() })
        ))
    }

    pub async fn update_by_id(
        State(_state): State<AppState>,
        Path(Params { id }): Path<Params>,
        Json(_payload): Json<Body>,
    ) -> Result<impl IntoResponse, (StatusCode, String)> {
        Ok((
            StatusCode::OK, 
            Json(Response { id: id.to_string() })
        ))
    }

    pub async fn delete_by_id(
        State(_state): State<AppState>,
        Path(Params { id: _ }): Path<Params>,
    ) -> Result<impl IntoResponse, (StatusCode,)> {
        Ok((
            StatusCode::NO_CONTENT,
        ))
    }
}