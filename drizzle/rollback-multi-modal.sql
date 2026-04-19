-- diploma_project/drizzle/0003_rollback.sql
-- Roll back multi-modal phishing expansion.
-- Idempotent: safe to run even if migration was not applied or was partially rolled back.

-- Guard DELETEs behind existence checks so re-running does not error when columns are already gone.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'answers' AND column_name = 'score'
  ) THEN
    DELETE FROM answers
      WHERE score IS NOT NULL OR inbox_selections IS NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'type'
  ) THEN
    DELETE FROM questions
      WHERE type != 'email';
  END IF;
END $$;

DROP TABLE IF EXISTS inbox_batches CASCADE;

ALTER TABLE answers DROP COLUMN IF EXISTS inbox_selections;
ALTER TABLE answers DROP COLUMN IF EXISTS score;

ALTER TABLE questions DROP COLUMN IF EXISTS type;
ALTER TABLE questions DROP COLUMN IF EXISTS content;
ALTER TABLE questions DROP COLUMN IF EXISTS batch_id;
