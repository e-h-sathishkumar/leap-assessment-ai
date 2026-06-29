INSERT INTO question_types
(name, description)
VALUES

('MCQ','Single Correct Answer'),

('Multiple Correct','More than one correct answer'),

('Assertion & Reason','Assertion and Reason type'),

('Integer','Integer answer'),

('Numerical','Numerical value answer'),

('Match the Following','Matching questions'),

('Statement Based','Statement-based questions')

ON CONFLICT (name)
DO NOTHING;