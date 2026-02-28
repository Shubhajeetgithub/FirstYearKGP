use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize)]
pub struct UserResponse {
    pub id: Uuid,
    pub roll_no: String,
    pub name: String,
    pub nickname: String,
    pub email: String,
}
