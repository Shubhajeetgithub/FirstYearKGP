-- Extensions pgcrypto for UUID type

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ENUM Type for user_type and verification status

CREATE TYPE user_type AS ENUM (
    'admin',
    'normal',
    'developer'
);

CREATE TYPE verification_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

-- Users Table

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    roll_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    nickname TEXT NOT NULL,

    password_hash TEXT NOT NULL,
    email TEXT NOT NULL,

    entry_date DATE NOT NULL,
    deleted_at TIMESTAMP,

    user_type user_type NOT NULL DEFAULT 'normal',

    CONSTRAINT user_is_from_ai_dept
        CHECK (roll_no ~ '^[0-9]{2}AI[0-9]{5}$')
    CONSTRAINT email_valid
        CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$')
);

-- Documents Table (Posts + Comments Unified)

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    author_id UUID NOT NULL,
    parent_id UUID,

    title TEXT,
    content TEXT,
    s3_key TEXT,

    verification_status verification_status NOT NULL DEFAULT 'pending',

    like_count INTEGER NOT NULL DEFAULT 0 CHECK (like_count >= 0),

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_documents_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_documents_parent
        FOREIGN KEY (parent_id)
        REFERENCES documents(id)
        ON DELETE SET NULL,

    CONSTRAINT content_or_file_check
        CHECK (
            (content IS NOT NULL AND s3_key IS NULL)
            OR
            (content IS NULL AND s3_key IS NOT NULL)
        )
);

-- Likes Table (Many-to-Many Relation)

CREATE TABLE likes (
    user_id UUID NOT NULL,
    document_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),

    PRIMARY KEY (user_id, document_id),

    CONSTRAINT fk_likes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_likes_document
        FOREIGN KEY (document_id)
        REFERENCES documents(id)
        ON DELETE CASCADE
);

-- Follows Table (Many-to-Many)

CREATE TABLE follows (
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),

    PRIMARY KEY (follower_id, following_id),

    CONSTRAINT fk_follows_follower
        FOREIGN KEY (follower_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_follows_following
        FOREIGN KEY (following_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT no_self_follow
        CHECK (follower_id <> following_id)
);

-- for tokens

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    token_hash TEXT NOT NULL,

    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    revoked_at TIMESTAMP,

    CONSTRAINT fk_refresh_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Indexes

-- Feed index (only visible documents)
CREATE INDEX idx_documents_feed
ON documents (created_at DESC)
WHERE deleted_at IS NULL;

-- Threading lookup
CREATE INDEX idx_documents_parent
ON documents (parent_id);

-- Fast like counting
CREATE INDEX idx_likes_document
ON likes (document_id);

-- Following feed lookup
CREATE INDEX idx_follows_follower
ON follows (follower_id);

-- Author lookup
CREATE INDEX idx_documents_author
ON documents (author_id);
