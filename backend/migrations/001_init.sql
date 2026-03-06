-- Custom Types & Enums

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

CREATE TYPE semester_time AS ENUM (
    'autumn',
    'spring'
);

CREATE TYPE document_category AS ENUM (
    'assignment',
    'notes',
    'exam',
    'project',
    'comment',
    'other'
);

-- Core Entities

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    roll_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    nickname TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    
    role user_type NOT NULL DEFAULT 'normal', -- Renamed to prevent ORM mapping collisions

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT user_is_from_ai_dept
        CHECK (roll_no ~ '^[0-9]{2}AI[0-9]{5}$'),

    CONSTRAINT email_valid
        CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$')
);

CREATE TABLE courses (
    course_id TEXT PRIMARY KEY,
    course_name TEXT NOT NULL
);

CREATE TABLE course_offerings (
    course_id TEXT NOT NULL,
    semester_year INTEGER NOT NULL,
    sem_time semester_time NOT NULL,
    professor TEXT NOT NULL,

    PRIMARY KEY (course_id, semester_year, sem_time, professor),

    CONSTRAINT fk_course
        FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
        ON DELETE CASCADE
);

-- Polymorphic Document Entity

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID,                     -- Self-referencing for comment trees
    author_id UUID NOT NULL,

    category document_category NOT NULL DEFAULT 'other',
    verification_status verification_status NOT NULL DEFAULT 'pending',

    -- Payload Data (Nullable to support varying document shapes)
    title TEXT,
    content TEXT,
    s3_key TEXT,

    -- Context Data (Completely optional metadata)
    course_id TEXT,
    semester_year INTEGER,
    sem_time semester_time,

    like_count INTEGER NOT NULL DEFAULT 0 CHECK (like_count >= 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_documents_parent
        FOREIGN KEY (parent_id)
        REFERENCES documents(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_documents_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_documents_course
        FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
        ON DELETE SET NULL,

    -- STI State Machine: mathematically guarantees structural correctness per type
    CONSTRAINT document_polymorphism_check
        CHECK (
            (category = 'comment' AND parent_id IS NOT NULL AND content IS NOT NULL AND TITLE IS NULL AND s3_key IS NULL) OR 
            (category != 'comment' AND parent_id IS NULL AND title IS NOT NULL AND (content IS NOT NULL OR s3_key IS NOT NULL))
        )
);

-- Relational & Auth Tables

CREATE TABLE likes (
    user_id UUID NOT NULL,
    document_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

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

CREATE TABLE follows (
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

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

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash TEXT NOT NULL,

    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at TIMESTAMPTZ,

    CONSTRAINT fk_refresh_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Indexing

-- Hierarchy traversal (Critical for fetching comment trees)
CREATE INDEX idx_documents_parent ON documents (parent_id);

-- Soft-delete aware feed lookups
CREATE INDEX idx_documents_feed ON documents (created_at DESC) WHERE deleted_at IS NULL;

-- Metadata filtering
CREATE INDEX idx_documents_course ON documents (course_id, semester_year, sem_time);
CREATE INDEX idx_documents_author ON documents (author_id);

-- Reverse relationship lookups (PK handles the forward lookup)
CREATE INDEX idx_likes_document ON likes (document_id);
CREATE INDEX idx_follows_following ON follows (following_id);
