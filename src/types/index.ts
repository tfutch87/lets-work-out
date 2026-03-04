export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'

export type PrimaryGoal =
  | 'weight_loss'
  | 'muscle_gain'
  | 'endurance'
  | 'general_fitness'
  | 'sport_specific'

export type WorkoutSource = 'manual' | 'ai_generated'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface UserProfile {
  id: string
  email: string
  name: string
  gender: string
  age: number
  fitness_level: FitnessLevel
  primary_goal: PrimaryGoal
  equipment_access: string[]
  days_per_week: number
  created_at: string
  onboarding_complete: boolean
}

export interface Exercise {
  id: string
  name: string
  muscle_groups: string[]
  equipment: string[]
  difficulty: Difficulty
  instructions: string
  video_url?: string | null
  gif_url?: string | null
  body_part?: string
  target_muscle?: string
  secondary_muscles?: string[]
  description?: string | null
  exercise_db_id?: string | null
  created_at: string
}

export interface WorkoutExercise {
  exercise_id: string
  exercise?: Exercise
  sets: number
  reps: string // e.g. "10" or "10-12" or "30s"
  rest_seconds: number
  notes?: string
  order_index: number
}

export interface WorkoutSession {
  day: number
  day_name?: string
  focus: string
  exercises: WorkoutExercise[]
}

export interface WorkoutWeek {
  week_number: number
  sessions: WorkoutSession[]
}

export interface WorkoutPlan {
  id: string
  user_id: string
  title: string
  description?: string
  source: WorkoutSource
  ai_prompt?: string
  weeks: number
  days_per_week: number
  sessions: WorkoutSession[]
  is_template: boolean
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface SetLog {
  reps: number | null
  weight: number | null
  completed: boolean
  notes?: string
}

export interface ExerciseLog {
  exercise_id: string
  exercise_name: string
  sets: SetLog[]
}

export interface WorkoutLog {
  id: string
  user_id: string
  plan_id?: string
  plan?: WorkoutPlan
  date: string
  duration_minutes?: number
  exercises_logged: ExerciseLog[]
  notes?: string
  completed: boolean
  created_at: string
}

export interface ProgressSummary {
  streak: number
  total_workouts: number
  workouts_this_week: number
  personal_records: PersonalRecord[]
  weekly_volume: WeeklyVolume[]
}

export interface PersonalRecord {
  exercise_id: string
  exercise_name: string
  max_weight: number
  max_reps: number
  date: string
}

export interface WeeklyVolume {
  week: string
  volume: number
  sessions: number
}

// AI Generation types
export interface AIGeneratedPlan {
  title: string
  description: string
  weeks: number
  days_per_week: number
  sessions: {
    day: number
    focus: string
    exercises: {
      name: string
      sets: number
      reps: string
      rest_seconds: number
      notes?: string
    }[]
  }[]
}
