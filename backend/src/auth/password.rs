use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};

// TODO: remove unwrap from hash_password

pub fn hash_password(password: &str) -> String {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .unwrap()
        .to_string()
}

pub fn verify_password(password: &str, hash: &str) -> bool {
    match PasswordHash::new(hash) {
        Ok(parsed) => {
            return Argon2::default()
                .verify_password(password.as_bytes(), &parsed)
                .is_ok();
        }
        Err(_) => {
            return false;
        }
    }
}

// test
#[cfg(test)]
mod tests {
    use crate::auth::password::{hash_password, verify_password};

    #[test]
    fn pass_test1() {
        let pswds = vec![
            "ajafoijsadoi23q04u12",
            "sdfji4@ejijasdf",
            "iaidfj234,ijauf.sdfn",
        ];
        for pass in pswds {
            assert!(verify_password(pass, hash_password(pass).as_str()));
        }
    }
}
