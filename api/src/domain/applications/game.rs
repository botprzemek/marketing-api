use crate::domain::entities::extab::ExtabEntry;
use crate::domain::repositories::extab::ExtabPort;

pub struct ExtabApplication<R: ExtabPort> {
    repository: Arc<R>,
}

impl<R: ExtabPort> GamesApplication<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn add_value(&self, value: i32) -> anyhow::Result<()> {
        self.repository.insert(ExtabEntry { a: value }).await?;
        Ok(())
    }

    pub async fn retrieve_value(&self, id: i32) -> anyhow::Result<Option<ExtabEntry>> {
        self.repository.get(id).await.map_err(|e| anyhow::anyhow!(e))
    }
}