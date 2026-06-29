-- =====================================================
-- LEAP Assessment AI
-- Bloom Levels Master
-- =====================================================

CREATE TABLE IF NOT EXISTS bloom_levels (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(30) NOT NULL UNIQUE,

    score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 6),

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS
idx_bloom_name
ON bloom_levels(name);