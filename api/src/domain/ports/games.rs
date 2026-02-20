use crate::domain::entities::extab::ExtabEntry;

use async_trait::async_trait;
use std::error::Error;

#[async_trait]
pub trait GamesPort: Send + Sync {
    async fn insert(&self, entry: ExtabEntry) -> Result<(), Box<dyn Error>>;
    async fn get(&self, id: i32) -> Result<Option<ExtabEntry>, Box<dyn Error>>;
}