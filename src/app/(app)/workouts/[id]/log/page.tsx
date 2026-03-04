'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Check, Timer, Loader2, Trophy, ChevronDown, ChevronUp, StopCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { WorkoutPlan, WorkoutSession, ExerciseLog, SetLog } from '@/types'

interface SessionExercise {
  name: string
  sets: number
  reps: string
  rest_seconds: number
  notes?: string
}

interface LoggedExercise extends ExerciseLog {
  plannedSets: number
  plannedReps: string
  restSeconds: number
  notes?: string
  expanded: boolean
}

export default function WorkoutLogPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>([])
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [restTimer, setRestTimer] = useState(0)
  const [restActive, setRestActive] = useState(false)
  const [saving, setSaving] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [notes, setNotes] = useState('')

  // Timer
  useEffect(() => {
    if (!sessionStarted) return
    const interval = setInterval(() => {
      setElapsed((e) => e + 1)
      if (restActive && restTimer > 0) setRestTimer((r) => r - 1)
      if (restTimer === 1) setRestActive(false)
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionStarted, restActive, restTimer])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('workout_plans')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setPlan(data)
        if (data?.sessions?.length === 1) {
          setSelectedSession(data.sessions[0])
        }
        setLoading(false)
      })
  }, [id])

  const startSession = (session: WorkoutSession) => {
    setSelectedSession(session)
    setSessionStarted(true)
    setStartTime(new Date())
    setLoggedExercises(
      session.exercises.map((ex) => {
        const exAny = ex as unknown as SessionExercise
        const name = ex.exercise?.name || exAny.name || 'Exercise'
        return {
          exercise_id: ex.exercise_id || '',
          exercise_name: name,
          plannedSets: ex.sets,
          plannedReps: ex.reps,
          restSeconds: ex.rest_seconds,
          notes: ex.notes,
          expanded: false,
          sets: Array.from({ length: ex.sets }, () => ({
            reps: null,
            weight: null,
            completed: false,
          })),
        }
      })
    )
  }

  const toggleExercise = (i: number) => {
    setLoggedExercises((prev) =>
      prev.map((ex, idx) => (idx === i ? { ...ex, expanded: !ex.expanded } : ex))
    )
  }

  const updateSet = (exIdx: number, setIdx: number, key: 'reps' | 'weight', value: string) => {
    setLoggedExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex
        const newSets = [...ex.sets]
        newSets[setIdx] = { ...newSets[setIdx], [key]: value ? parseFloat(value) : null }
        return { ...ex, sets: newSets }
      })
    )
  }

  const toggleSetComplete = (exIdx: number, setIdx: number) => {
    setLoggedExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex
        const newSets = [...ex.sets]
        const wasCompleted = newSets[setIdx].completed
        newSets[setIdx] = { ...newSets[setIdx], completed: !wasCompleted }
        if (!wasCompleted && ex.restSeconds > 0) {
          setRestTimer(ex.restSeconds)
          setRestActive(true)
        }
        return { ...ex, sets: newSets }
      })
    )
  }

  const completedSets = loggedExercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0)
  const totalSets = loggedExercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0

  const finishWorkout = async () => {
    setSaving(true)
    const duration = startTime ? Math.round((Date.now() - startTime.getTime()) / 60000) : undefined

    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_id: id,
        date: new Date().toISOString().split('T')[0],
        duration_minutes: duration,
        exercises_logged: loggedExercises.map(({ exercise_id, exercise_name, sets }) => ({
          exercise_id,
          exercise_name,
          sets,
        })),
        notes,
        completed: true,
      }),
    })

    setSaving(false)
    setCompleted(true)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48 bg-slate-800" />
        <Skeleton className="h-48 bg-slate-800" />
      </div>
    )
  }

  // Completed state
  if (completed) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="text-7xl mb-6">🏆</div>
        <h1 className="text-3xl font-bold text-white mb-2">Workout complete!</h1>
        <p className="text-slate-400 mb-2">
          {completedSets} of {totalSets} sets completed
        </p>
        {startTime && (
          <p className="text-slate-500 text-sm mb-8">
            Duration: {formatTime(elapsed)}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/progress">
            <Button className="bg-violet-500 hover:bg-violet-600 text-white">
              View progress
            </Button>
          </Link>
          <Link href="/workouts">
            <Button variant="outline" className="border-white/20 text-slate-300 hover:text-white hover:bg-white/5">
              Back to workouts
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Session selection (if multiple sessions in plan)
  if (!sessionStarted && plan && plan.sessions.length > 1) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/workouts/${id}`} className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Choose session</h1>
            <p className="text-slate-400 text-sm">{plan.title}</p>
          </div>
        </div>
        <div className="space-y-3">
          {plan.sessions.map((session, i) => (
            <button
              key={i}
              onClick={() => startSession(session)}
              className="w-full text-left bg-slate-800/50 border border-white/10 rounded-lg p-4 hover:bg-slate-800 transition-colors"
            >
              <p className="font-semibold text-white">Day {session.day}: {session.focus}</p>
              <p className="text-sm text-slate-400 mt-0.5">{session.exercises.length} exercises</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Auto-start if single session and not started
  if (!sessionStarted && plan?.sessions.length === 1 && selectedSession) {
    startSession(selectedSession)
  }

  // Active logging
  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sticky top-16 bg-slate-950 py-3 z-10">
        <div className="flex items-center gap-3">
          <Link href={`/workouts/${id}`} className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-white">{selectedSession?.focus}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {formatTime(elapsed)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-white">{completedSets}/{totalSets} sets</p>
          <p className="text-xs text-violet-400">{progressPct}% done</p>
        </div>
      </div>

      {/* Progress bar */}
      <Progress value={progressPct} className="mb-6 h-2 bg-slate-800" />

      {/* Rest timer */}
      {restActive && restTimer > 0 && (
        <div className="bg-violet-500/20 border border-violet-500/30 rounded-lg p-3 mb-4 flex items-center justify-between">
          <p className="text-violet-300 text-sm font-medium">Rest timer</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-violet-400">{restTimer}s</span>
            <button onClick={() => setRestActive(false)} className="text-violet-400 hover:text-violet-300">
              <StopCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-3">
        {loggedExercises.map((ex, exIdx) => {
          const completedCount = ex.sets.filter((s) => s.completed).length
          const allDone = completedCount === ex.sets.length
          return (
            <Card key={exIdx} className={cn(
              'border-white/10 text-white transition-all',
              allDone ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-slate-800/50'
            )}>
              <button
                className="w-full flex items-center justify-between px-4 py-3"
                onClick={() => toggleExercise(exIdx)}
              >
                <div className="text-left flex items-center gap-3">
                  {allDone && <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                  <div>
                    <p className="font-semibold text-sm">{ex.exercise_name}</p>
                    {ex.notes && <p className="text-xs text-slate-500 mt-0.5">{ex.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{completedCount}/{ex.sets.length}</span>
                  {ex.expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
              </button>

              {ex.expanded && (
                <CardContent className="pt-0 px-4 pb-4">
                  <div className="border-t border-white/5 pt-3">
                    {/* Header row */}
                    <div className="grid grid-cols-[1fr_2fr_2fr_auto] gap-2 mb-2 text-xs text-slate-500">
                      <span>Set</span>
                      <span>Weight (kg)</span>
                      <span>Reps</span>
                      <span className="w-8"></span>
                    </div>
                    {ex.sets.map((set, setIdx) => (
                      <div key={setIdx} className={cn(
                        'grid grid-cols-[1fr_2fr_2fr_auto] gap-2 items-center mb-2',
                        set.completed && 'opacity-60'
                      )}>
                        <span className="text-sm text-slate-400">{setIdx + 1}</span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={set.weight ?? ''}
                          onChange={(e) => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                          disabled={set.completed}
                          className="h-8 bg-white/5 border-white/10 text-white text-sm"
                        />
                        <Input
                          type="number"
                          placeholder={ex.plannedReps.split('-')[0] || '10'}
                          value={set.reps ?? ''}
                          onChange={(e) => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                          disabled={set.completed}
                          className="h-8 bg-white/5 border-white/10 text-white text-sm"
                        />
                        <button
                          onClick={() => toggleSetComplete(exIdx, setIdx)}
                          className={cn(
                            'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all',
                            set.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-white/20 text-slate-500 hover:border-emerald-500/50'
                          )}
                        >
                          {set.completed && <Check className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Notes */}
      <div className="mt-4">
        <Input
          placeholder="Session notes (optional)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-slate-800 border-white/10 text-white placeholder:text-slate-600"
        />
      </div>

      {/* Finish button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur border-t border-white/10 z-10">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={finishWorkout}
            disabled={saving}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-base py-6"
          >
            {saving ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Trophy className="mr-2 h-5 w-5" />
            )}
            Finish workout
          </Button>
        </div>
      </div>
    </div>
  )
}
