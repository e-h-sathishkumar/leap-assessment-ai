-- =====================================================
-- LEAP Assessment AI
-- Difficulty Levels Schema
-- =====================================================

CREATE TABLE IF NOT EXISTS difficulty_levels (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(20) NOT NULL UNIQUE,

    score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 10),

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS
idx_difficulty_name
ON difficulty_levels(name);