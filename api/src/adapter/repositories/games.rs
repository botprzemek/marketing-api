use std::sync::Arc;
use futures::TryStreamExt;

use scylla::client::session::Session;
use scylla::statement::prepared::PreparedStatement;
use scylla::DeserializeRow;

#[derive(serde::Serialize)]
#[derive(DeserializeRow)]
pub struct Game {
    a: i32
}

#[derive(Clone)]
pub struct GamesRepository {
    pub session: Arc<Session>,
    pub stmt: PreparedStatement,
}

impl GamesRepository {
    pub async fn new(session: Arc<Session>) -> Self {
        let stmt = session
            .prepare("
                SELECT a
                FROM ks.extab
                ")
            .await
            .unwrap();

        GamesRepository {
            session,
            stmt,
        }
    }

    pub async fn select_games(self) -> Result<Vec<Game>, Box<dyn std::error::Error>> {
        let games = self.session
            .execute_iter(self.stmt, &[])
            .await?
            .rows_stream::<Game>()?
            .try_collect::<Vec<Game>>()
            .await?;

        Ok(games)
    }
}