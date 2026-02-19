use async_trait::async_trait;
use scylla::client::session::Session;
use crate::domain::repositories::extab_repository::ExtabRepository;
use crate::domain::entities::extab::ExtabEntry;
use std::error::Error;

pub struct ScyllaExtabRepository {
    session: Session,
}

impl ScyllaExtabRepository {
    pub fn new(session: Session) -> Self {
        Self { session }
    }
}

#[async_trait]
impl ExtabRepository for ScyllaExtabRepository {
    async fn insert(&self, entry: ExtabEntry) -> Result<(), Box<dyn Error>> {
        self.session
            .query_unpaged("INSERT INTO ks.extab (a) VALUES (?)", (entry.a,))
            .await?;
        Ok(())
    }

    async fn get(&self, id: i32) -> Result<Option<ExtabEntry>, Box<dyn Error>> {
        let rows = self.session
            .query_unpaged("SELECT a FROM ks.extab WHERE a = ?", (id,))
            .await?;

        let mut rows = rows.rows_typed::<(i32,)>()?;

        if let Some(Ok(row)) = rows.next() {
            return Ok(Some(ExtabEntry { a: row.0 }));
        }

        Ok(None)
    }
}
