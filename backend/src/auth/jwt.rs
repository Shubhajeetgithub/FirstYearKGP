use jsonwebtoken::{
    Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode,
    errors::Error as JwtLibError,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use time::{Duration, OffsetDateTime};
use uuid::Uuid;

// Claims

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub exp: i64,
    pub iat: i64,
}

// JWT Config

#[derive(Clone)]
pub struct JwtConfig {
    encoding_key: Arc<EncodingKey>,
    decoding_key: Arc<DecodingKey>,
    validation: Validation,
    access_token_ttl: Duration,
}

impl JwtConfig {
    pub fn new(secret: &str) -> Self {
        let encoding_key = EncodingKey::from_secret(secret.as_bytes());
        let decoding_key = DecodingKey::from_secret(secret.as_bytes());

        let mut validation = Validation::new(Algorithm::HS256);
        validation.validate_exp = true;

        Self {
            encoding_key: Arc::new(encoding_key),
            decoding_key: Arc::new(decoding_key),
            validation,
            access_token_ttl: Duration::minutes(15),
        }
    }

    // Create Access Token
    pub fn create_access_token(&self, user_id: Uuid) -> Result<String, JwtError> {
        let now = OffsetDateTime::now_utc();
        let exp = now + self.access_token_ttl;

        let claims = Claims {
            sub: user_id,
            iat: now.unix_timestamp(),
            exp: exp.unix_timestamp(),
        };

        encode(&Header::new(Algorithm::HS256), &claims, &self.encoding_key)
            .map_err(JwtError::Encoding)
    }

    // Verify Token
    pub fn verify(&self, token: &str) -> Result<Claims, JwtError> {
        let data = decode::<Claims>(token, &self.decoding_key, &self.validation)
            .map_err(JwtError::Decoding)?;

        Ok(data.claims)
    }
}

// Error Type

#[derive(Debug)]
pub enum JwtError {
    Encoding(JwtLibError),
    Decoding(JwtLibError),
}
