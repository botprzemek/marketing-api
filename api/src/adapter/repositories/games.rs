use futures::TryStreamExt;
use scylla::client::session::Session;
use scylla::statement::prepared::PreparedStatement;
use scylla::value::CqlTimestamp;
use scylla::{DeserializeRow, SerializeRow};
use serde::Serialize;
use std::sync::Arc;
use uuid::Uuid;

#[derive(SerializeRow, DeserializeRow)]
pub struct GameRow {
    id: Uuid,
    created_at: CqlTimestamp,
    updated_at: Option<CqlTimestamp>,
}

#[derive(Serialize)]
pub struct Game {
    id: Uuid,
    created_at: i64,
    updated_at: Option<i64>,
}

impl From<GameRow> for Game {
    fn from(row: GameRow) -> Self {
        Self {
            id: row.id,
            created_at: row.created_at.0,
            updated_at: row.updated_at.map(|t| t.0),
        }
    }
}

#[derive(Clone)]
pub struct GamesRepository {
    pub session: Arc<Session>,
    pub stmt: PreparedStatement,
}

impl GamesRepository {
    pub async fn new(session: Arc<Session>) -> Self {
        let stmt = session
            .prepare(
                "
                SELECT
                    id,
                    created_at,
                    updated_at
                FROM
                    api.games
                ",
            )
            .await
            .unwrap();

        GamesRepository { session, stmt }
    }

    pub async fn select_games(&self) -> Result<Vec<Game>, Box<dyn std::error::Error>> {
        let games = self
            .session
            .execute_iter(self.stmt.clone(), &[])
            .await?
            .rows_stream::<GameRow>()?
            .map_ok(|row| Game::from(row))
            .try_collect::<Vec<Game>>()
            .await?;

        Ok(games)
    }
}
