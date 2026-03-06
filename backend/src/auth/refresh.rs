use rand::{TryRng, rngs::SysRng};
use sha2::{Digest, Sha256};

// Generate Refresh Token
//
// We generate 32 random bytes (256 bits)
// Encode as hex string (64 chars)
// Entropy: 2^256

pub fn generate_refresh_token() -> Option<String> {
    let mut bytes = [0u8; 32];
    match SysRng.try_fill_bytes(&mut bytes) {
        Ok(()) => return Some(hex::encode(bytes)),
        Err(e) => {
            eprintln!("refresh token generation error: {e}");
            return None;
        }
    };
}

// Hash Token Before DB
//
// We store only SHA-256 hash of refresh token.
// If DB leaks, raw tokens are not exposed.

pub fn hash_token(token: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(token.as_bytes());
    let result = hasher.finalize();

    hex::encode(result)
}
