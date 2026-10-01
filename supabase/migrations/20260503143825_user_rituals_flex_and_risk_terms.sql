/*
  # Flex user_rituals for local ritual catalog and ensure risk_events accepts array

  1. Changes
    - `user_rituals.ritual_id` made nullable and its FK dropped so the client can
      reference local (non-DB) rituals by slug.
    - Add `user_rituals.ritual_key` (text) to identify the local ritual.

  2. Notes
    - Existing rows keep their data. No destructive drops of columns or tables.
    - `risk_events.detected_terms` is already `text[]`; no change needed.
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'user_rituals_ritual_id_fkey'
      AND table_name = 'user_rituals'
  ) THEN
    ALTER TABLE user_rituals DROP CONSTRAINT user_rituals_ritual_id_fkey;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_rituals' AND column_name = 'ritual_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE user_rituals ALTER COLUMN ritual_id DROP NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_rituals' AND column_name = 'ritual_key'
  ) THEN
    ALTER TABLE user_rituals ADD COLUMN ritual_key text DEFAULT '';
  END IF;
END $$;
