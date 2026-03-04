-- LetsWorkOut Database Schema
-- Run this in your Supabase SQL editor

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  gender TEXT,
  age INTEGER,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  primary_goal TEXT CHECK (primary_goal IN ('weight_loss', 'muscle_gain', 'endurance', 'general_fitness', 'sport_specific')),
  equipment_access TEXT[] DEFAULT '{}',
  days_per_week INTEGER DEFAULT 3,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- EXERCISES
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  muscle_groups TEXT[] NOT NULL DEFAULT '{}',
  equipment TEXT[] NOT NULL DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  instructions TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public read access for exercises
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercises are viewable by everyone"
  ON public.exercises FOR SELECT
  USING (TRUE);

-- ============================================
-- WORKOUT PLANS
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT CHECK (source IN ('manual', 'ai_generated')) DEFAULT 'manual',
  ai_prompt TEXT,
  weeks INTEGER DEFAULT 1,
  days_per_week INTEGER DEFAULT 3,
  sessions JSONB DEFAULT '[]',
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own workout plans"
  ON public.workout_plans FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public plans are viewable by everyone"
  ON public.workout_plans FOR SELECT
  USING (is_public = TRUE);

-- ============================================
-- WORKOUT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER,
  exercises_logged JSONB DEFAULT '[]',
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own workout logs"
  ON public.workout_logs FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON public.workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON public.workout_logs(date);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_groups ON public.exercises USING GIN(muscle_groups);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON public.exercises USING GIN(equipment);

-- ============================================
-- UPDATED_AT trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at BEFORE UPDATE ON public.workout_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
