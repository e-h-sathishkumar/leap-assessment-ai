-- =====================================================
-- LEAP Assessment AI
-- Question Options
-- =====================================================

CREATE TABLE IF NOT EXISTS question_options (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    question_id BIGINT NOT NULL
        REFERENCES question_bank(id)
        ON DELETE CASCADE,

    option_label CHAR(1) NOT NULL,

    option_text TEXT NOT NULL,

    is_correct BOOLEAN DEFAULT FALSE,

    display_order SMALLINT DEFAULT 1,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_question_options
ON question_options(question_id);