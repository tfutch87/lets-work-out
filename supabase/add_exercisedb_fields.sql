-- ExerciseDB fields migration
-- Run this entire script in Supabase SQL Editor (Database → SQL Editor → New query)
-- Safe to run multiple times (uses IF NOT EXISTS / DROP IF EXISTS)

-- Step 1: Add ExerciseDB columns to exercises table
ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS gif_url TEXT,
  ADD COLUMN IF NOT EXISTS body_part TEXT,
  ADD COLUMN IF NOT EXISTS target_muscle TEXT,
  ADD COLUMN IF NOT EXISTS secondary_muscles TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS exercise_db_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 2: Index for fast lookup by ExerciseDB ID
CREATE INDEX IF NOT EXISTS idx_exercises_db_id ON public.exercises(exercise_db_id);

-- Step 3: Allow service role to insert/update exercises (used by sync route)
-- The sync route uses the service role key which bypasses RLS, so no extra policy needed.
-- But if you ever call from a user context, this policy allows admin inserts:
DROP POLICY IF EXISTS "Admins can manage exercises" ON public.exercises;

-- Step 4: Verify — should show all columns including the 6 new ones
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'exercises'
ORDER BY ordinal_position;
