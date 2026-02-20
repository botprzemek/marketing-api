use std::env::var;

pub struct Config {
    server_host: String,
    server_port: i32,

    database_host: String,
    database_port: i32,
}

impl Config {
    pub fn load() -> Result<Self, String> {
        let server_host = var("SERVER_HOST")
            .map_err(|_| "Missing environment variable SERVER_HOST")?;
        let server_port = var("SERVER_PORT")
            .map_err(|_| "Missing environment variable SERVER_PORT")?
            .parse::<i32>()
            .map_err(|_| "Invalid environment variable SERVER_PORT")?;

        let database_host = var("DATABASE_HOST")
            .map_err(|_| "Missing environment variable DATABASE_HOST")?;
        let database_port = var("DATABASE_PORT")
            .map_err(|_| "Missing environment variable DATABASE_PORT")?
            .parse::<i32>()
            .map_err(|_| "Invalid environment variable DATABASE_PORT")?;

        Ok(Config {
            server_host,
            server_port,
            database_host,
            database_port,
        })
    }

    pub fn get_server_url(&self) -> String {
        format!("{}:{}", self.server_host, self.server_port)
    }

    pub fn get_database_url(&self) -> String {
        format!("{}:{}", self.database_host, self.database_port)
    }
}