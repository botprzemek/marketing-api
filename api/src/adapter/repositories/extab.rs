// use async_trait::async_trait;
// use crate::domain::repositories::extab_repository::ExtabRepository;
// use crate::domain::entities::extab::ExtabEntry;

// use super::scylla_extab_repository::ScyllaExtabRepository;
// use crate::adapter::cache::valkey_cache::ValkeyCache;

// pub struct ScyllaCachedExtabRepository {
//     scylla: ScyllaExtabRepository,
//     cache: ValkeyCache,
// }

// impl ScyllaCachedExtabRepository {
//     pub fn new(scylla: ScyllaExtabRepository, cache: ValkeyCache) -> Self {
//         Self { scylla, cache }
//     }
// }

// #[async_trait]
// impl ExtabRepository for ScyllaCachedExtabRepository {
//     async fn insert(&self, entry: ExtabEntry) -> Result<(), Box<dyn std::error::Error>> {
//         self.scylla.insert(entry.clone()).await?;
//         self.cache.set(entry.a, entry.a).await;
//         Ok(())
//     }

//     async fn get(&self, id: i32) -> Result<Option<ExtabEntry>, Box<dyn std::error::Error>> {
//         if let Some(cached) = self.cache.get(id).await {
//             return Ok(Some(ExtabEntry { a: cached }));
//         }

//         let fresh = self.scylla.get(id).await?;
//         if let Some(ref f) = fresh {
//             self.cache.set(id, f.a).await;
//         }

//         Ok(fresh)
//     }
// }