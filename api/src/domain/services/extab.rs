use repositories::extab::ExtabPort;
use entities::extab::ExtabEntry;

pub struct ExtabService<R: ExtabPort> {
    repo: R,
}

impl<R: ExtabPort> ExtabService<R> {
    pub fn new(repo: R) -> Self {
        Self { repo }
    }

    pub async fn create(&self, value: i32) -> anyhow::Result<()> {
        self.repo.insert(ExtabEntry { a: value }).await?;
        Ok(())
    }

    pub async fn read(&self, key: i32) -> anyhow::Result<Option<ExtabEntry>> {
        self.repo.get(key).await.map_err(|e| anyhow::anyhow!(e))
    }
}