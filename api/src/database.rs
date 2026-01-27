use surrealdb::engine::remote::ws::Client;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;

pub async fn connect() -> Result<Surreal<Client>, surrealdb::Error> {
  let database = Surreal::new::<Ws>("database:8000").await?;

  database.signin(Root {
    username: "root",
    password: "root",
  })
  .await?;

  database.use_ns("auth").use_db("auth").await?;
  Ok(database)
}
