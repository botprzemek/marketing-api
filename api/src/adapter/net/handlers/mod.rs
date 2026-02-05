

// mod routes {
//     use crate::DB;
//     use crate::error::Error;

//     use axum::{Json, extract::Path};
//     use faker_rand::en_us::internet::Email;
//     use faker_rand::en_us::names::FirstName;
//     use rand::{Rng, distributions::Alphanumeric};
//     use serde::{Deserialize, Serialize};
//     use surrealdb::{RecordId, opt::auth::Record};

//     const PERSON: &str = "person";

//     #[derive(Serialize, Deserialize, Clone)]
//     pub struct PersonData {
//         name: String,
//     }

//     #[derive(Serialize, Deserialize)]
//     pub struct Person {
//         name: String,
//         id: RecordId,
//     }

//     pub async fn paths() -> &'static str {
//         r#"
// -----------------------------------------------------------------------------------------------------------------------------------------
//         PATH                |           SAMPLE COMMAND                                                                                  
// -----------------------------------------------------------------------------------------------------------------------------------------
// /session: See session data  |  curl -X GET    -H "Content-Type: application/json"                      http://localhost:8080/session
//                             |
// /person/{id}:               |
//   Create a person           |  curl -X POST   -H "Content-Type: application/json" -d '{"name":"John"}' http://localhost:8080/person/one
//   Update a person           |  curl -X PUT    -H "Content-Type: application/json" -d '{"name":"Jane"}' http://localhost:8080/person/one
//   Get a person              |  curl -X GET    -H "Content-Type: application/json"                      http://localhost:8080/person/one
//   Delete a person           |  curl -X DELETE -H "Content-Type: application/json"                      http://localhost:8080/person/one
//                             |
// /people: List all people    |  curl -X GET    -H "Content-Type: application/json"                      http://localhost:8080/people

// /new_user:  Create a new record user
// /new_token: Get instructions for a new token if yours has expired"#
//     }

//     pub async fn session() -> Result<Json<String>, Error> {
//         let res: Option<String> = DB.query("RETURN <string>$session").await?.take(0)?;

//         Ok(Json(res.unwrap_or("No session data found!".into())))
//     }

//     pub async fn create_person(
//         id: Path<String>,
//         Json(person): Json<PersonData>,
//     ) -> Result<Json<Option<Person>>, Error> {
//         let person = DB.create((PERSON, &*id)).content(person).await?;
//         Ok(Json(person))
//     }

//     pub async fn read_person(id: Path<String>) -> Result<Json<Option<Person>>, Error> {
//         let person = DB.select((PERSON, &*id)).await?;
//         Ok(Json(person))
//     }

//     pub async fn update_person(
//         id: Path<String>,
//         Json(person): Json<PersonData>,
//     ) -> Result<Json<Option<Person>>, Error> {
//         let person = DB.update((PERSON, &*id)).content(person).await?;
//         Ok(Json(person))
//     }

//     pub async fn delete_person(id: Path<String>) -> Result<Json<Option<Person>>, Error> {
//         let person = DB.delete((PERSON, &*id)).await?;
//         Ok(Json(person))
//     }

//     pub async fn list_people() -> Result<Json<Vec<Person>>, Error> {
//         let people = DB.select(PERSON).await?;
//         Ok(Json(people))
//     }

//     #[derive(Serialize, Deserialize)]
//     struct Params<'a> {
//         name: &'a str,
//         email: &'a str,
//         password: &'a str,
//     }

//     pub async fn make_new_user() -> Result<String, Error> {
//         let name = rand::random::<FirstName>().to_string();
//         let email = rand::random::<Email>().to_string();
//         let password = rand::thread_rng()
//             .sample_iter(&Alphanumeric)
//             .take(7)
//             .map(char::from)
//             .collect::<String>();

//         let hashed_password = blake3::hash(password.as_bytes()).to_string();

//         let jwt = DB
//             .signup(Record {
//                 namespace: "oauth",
//                 database: "oauth",
//                 access: "account",
//                 params: Params {
//                     name: &name,
//                     email: &email,
//                     password: &hashed_password,
//                 },
//             })
//             .await?
//             .into_insecure_token();
//         Ok(format!(
//             "New user created!\n\nName: {name}\nPassword: {password}\nToken: {jwt}\n\nTo log in, use this command:\n\nsurreal sql --pretty --token \"{jwt}\""
//         ))
//     }

//     pub async fn get_new_token() -> String {
//         let command = r#"curl -X POST -H "Accept: application/json" -d '{"ns":"test","db":"test","ac":"account","user":"your_username","pass":"your_password"}' http://localhost:8000/signin"#;
//         format!(
//             "Need a new token? Use this command:\n\n{command}\n\nThen log in with surreal sql --pretty --token YOUR_TOKEN_HERE"
//         )
//     }
// }