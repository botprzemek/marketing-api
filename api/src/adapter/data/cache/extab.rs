use deadpool_redis::{Pool, redis::cmd};

pub struct ValkeyCache {
    pool: Pool,
}

impl ValkeyCache {
    pub fn new(pool: Pool) -> Self {
        Self { pool }
    }

    pub async fn get(&self, key: i32) -> Option<i32> {
        if let Ok(mut conn) = self.pool.get().await {
            if let Ok(v) = cmd("GET")
                .arg(format!("extab:{}", key))
                .query_async::<_, Option<i32>>(&mut conn)
                .await 
            {
                return v;
            }
        }
        None
    }

    pub async fn set(&self, key: i32, value: i32) {
        if let Ok(mut conn) = self.pool.get().await {
            let _ = cmd("SET")
                .arg(format!("extab:{}", key))
                .arg(value)
                .query_async::<_, ()>(&mut conn)
                .await;
        }
    }
}