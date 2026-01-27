use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
  pub id: String,
  pub email: String,
  pub first_name: String,
  pub last_name: String,
}
