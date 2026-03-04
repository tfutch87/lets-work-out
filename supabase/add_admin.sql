-- Add admin support to LetsWorkOut
-- Run this in Supabase SQL Editor

-- 1. Add is_admin column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. RLS policy: admins can read ALL profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- 3. Grant yourself admin access
-- Replace 'your@email.com' with your actual email before running
UPDATE public.profiles
  SET is_admin = TRUE
  WHERE email = 'tfutch87@yahoo.com';
