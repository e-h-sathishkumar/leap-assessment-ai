INSERT INTO bloom_levels
(name, score, description)
VALUES

('Remember',1,'Recall facts and definitions'),

('Understand',2,'Explain ideas and concepts'),

('Apply',3,'Use knowledge in new situations'),

('Analyze',4,'Break information into parts'),

('Evaluate',5,'Justify a decision'),

('Create',6,'Produce original work')

ON CONFLICT (name)
DO NOTHING;