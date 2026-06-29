-- =====================================================
-- LEAP ASSESSMENT AI
-- QUESTION BANK
-- Version : 1.0
-- =====================================================

CREATE TABLE IF NOT EXISTS question_bank (

    -- =================================================
    -- PRIMARY KEY
    -- =================================================

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- =================================================
    -- ACADEMIC HIERARCHY
    -- =================================================

    subject_id BIGINT NOT NULL
        REFERENCES subjects(id),

    chapter_id BIGINT NOT NULL
        REFERENCES chapters(id),

    topic_id BIGINT NOT NULL
        REFERENCES topics(id),

    difficulty_level_id BIGINT NOT NULL
        REFERENCES difficulty_levels(id),

    bloom_level_id BIGINT NOT NULL
        REFERENCES bloom_levels(id),

    question_type_id BIGINT NOT NULL
        REFERENCES question_types(id),

    -- =================================================
    -- QUESTION
    -- =================================================

    question_text TEXT NOT NULL,

    option_a TEXT,

    option_b TEXT,

    option_c TEXT,

    option_d TEXT,

    correct_answer CHAR(1)
        CHECK (correct_answer IN ('A','B','C','D')),

    -- =================================================
    -- LEARNING SUPPORT
    -- =================================================

    answer_key TEXT,

    explanation TEXT,

    hint TEXT,

    learning_objective TEXT,

    -- =================================================
    -- ASSESSMENT
    -- =================================================

    marks NUMERIC(5,2)
        NOT NULL DEFAULT 4,

    negative_marks NUMERIC(5,2)
        NOT NULL DEFAULT 1,

    estimated_time_seconds INTEGER
        DEFAULT 90,

    -- =================================================
    -- SOURCE INFORMATION
    -- =================================================

    source_type VARCHAR(30)
        DEFAULT 'Teacher',

    source_reference TEXT,

    academic_year VARCHAR(20),

    -- =================================================
    -- SEARCH
    -- =================================================

    tags TEXT,

    keywords TEXT,

    -- =================================================
    -- AI INFORMATION
    -- =================================================

    generated_by VARCHAR(30)
        DEFAULT 'Teacher',

    ai_model VARCHAR(50),

    generation_prompt TEXT,

    -- =================================================
    -- QUALITY CONTROL
    -- =================================================

    status VARCHAR(20)
        DEFAULT 'Draft'
        CHECK (
            status IN (
                'Draft',
                'AI Generated',
                'Reviewed',
                'Approved',
                'Archived'
            )
        ),

    is_active BOOLEAN
        DEFAULT TRUE,

    -- =================================================
    -- AUDIT
    -- =================================================

    created_by UUID,

    created_at TIMESTAMPTZ
        DEFAULT NOW(),

    updated_at TIMESTAMPTZ
        DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_qb_subject
ON question_bank(subject_id);

CREATE INDEX IF NOT EXISTS idx_qb_chapter
ON question_bank(chapter_id);

CREATE INDEX IF NOT EXISTS idx_qb_topic
ON question_bank(topic_id);

CREATE INDEX IF NOT EXISTS idx_qb_difficulty
ON question_bank(difficulty_level_id);

CREATE INDEX IF NOT EXISTS idx_qb_bloom
ON question_bank(bloom_level_id);

CREATE INDEX IF NOT EXISTS idx_qb_question_type
ON question_bank(question_type_id);

CREATE INDEX IF NOT EXISTS idx_qb_status
ON question_bank(status);

CREATE INDEX IF NOT EXISTS idx_qb_generated_by
ON question_bank(generated_by);

CREATE INDEX IF NOT EXISTS idx_qb_active
ON question_bank(is_active);