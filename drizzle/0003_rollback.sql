-- diploma_project/drizzle/0003_rollback.sql
-- Roll back multi-modal phishing expansion.
-- Safe to run even if multiple migrations applied; operations use IF EXISTS.

DELETE FROM answers
  WHERE score IS NOT NULL OR inbox_selections IS NOT NULL;

DELETE FROM questions
  WHERE type != 'email';

DROP TABLE IF EXISTS inbox_batches CASCADE;

ALTER TABLE answers DROP COLUMN IF EXISTS inbox_selections;
ALTER TABLE answers DROP COLUMN IF EXISTS score;

ALTER TABLE questions DROP COLUMN IF EXISTS type;
ALTER TABLE questions DROP COLUMN IF EXISTS content;
ALTER TABLE questions DROP COLUMN IF EXISTS batch_id;
