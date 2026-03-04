import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get all completed logs
  const { data: logs, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Calculate streak
  const streak = calculateStreak(logs || [])

  // Weekly volume (last 8 weeks)
  const weeklyVolume = calculateWeeklyVolume(logs || [])

  // Personal records
  const prs = calculatePersonalRecords(logs || [])

  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  const workoutsThisWeek = (logs || []).filter((log) => {
    const logDate = new Date(log.date)
    return logDate >= startOfWeek
  }).length

  return NextResponse.json({
    streak,
    total_workouts: logs?.length || 0,
    workouts_this_week: workoutsThisWeek,
    personal_records: prs,
    weekly_volume: weeklyVolume,
  })
}

function calculateStreak(logs: { date: string }[]): number {
  if (!logs.length) return 0

  const dates = [...new Set(logs.map((l) => l.date))].sort().reverse()
  let streak = 0
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (dates[0] !== today && dates[0] !== yesterday) return 0

  let currentDate = new Date(dates[0])
  for (const date of dates) {
    const d = new Date(date)
    const diffDays = Math.round((currentDate.getTime() - d.getTime()) / 86400000)
    if (diffDays <= 1) {
      streak++
      currentDate = d
    } else {
      break
    }
  }
  return streak
}

function calculateWeeklyVolume(logs: { date: string; exercises_logged: { sets: { weight: number | null; reps: number | null; completed: boolean }[] }[] }[]) {
  const weekMap: Record<string, { volume: number; sessions: number }> = {}

  for (const log of logs) {
    const date = new Date(log.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]

    if (!weekMap[weekKey]) weekMap[weekKey] = { volume: 0, sessions: 0 }
    weekMap[weekKey].sessions++

    for (const exercise of log.exercises_logged || []) {
      for (const set of exercise.sets || []) {
        if (set.completed && set.weight && set.reps) {
          weekMap[weekKey].volume += set.weight * set.reps
        }
      }
    }
  }

  return Object.entries(weekMap)
    .map(([week, data]) => ({ week, ...data }))
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-8)
}

function calculatePersonalRecords(logs: { exercises_logged: { exercise_id?: string; exercise_name: string; sets: { weight: number | null; reps: number | null; completed: boolean }[] }[]; date: string }[]) {
  const prMap: Record<string, { max_weight: number; max_reps: number; date: string; exercise_name: string }> = {}

  for (const log of logs) {
    for (const exercise of log.exercises_logged || []) {
      const key = exercise.exercise_name
      if (!prMap[key]) {
        prMap[key] = { max_weight: 0, max_reps: 0, date: log.date, exercise_name: key }
      }
      for (const set of exercise.sets || []) {
        if (set.completed) {
          if ((set.weight || 0) > prMap[key].max_weight) {
            prMap[key].max_weight = set.weight || 0
            prMap[key].date = log.date
          }
          if ((set.reps || 0) > prMap[key].max_reps) {
            prMap[key].max_reps = set.reps || 0
          }
        }
      }
    }
  }

  return Object.values(prMap)
    .filter((pr) => pr.max_weight > 0 || pr.max_reps > 0)
    .sort((a, b) => b.max_weight - a.max_weight)
    .slice(0, 10)
}
