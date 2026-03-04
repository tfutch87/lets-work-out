'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Zap, Dumbbell, Calendar, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import type { WorkoutPlan } from '@/types'

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSessions, setExpandedSessions] = useState<Record<number, boolean>>({})
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('workout_plans')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setPlan(data)
        // Expand first session by default
        if (data?.sessions?.[0]) setExpandedSessions({ 0: true })
        setLoading(false)
      })
  }, [id])

  const deletePlan = async () => {
    if (!confirm('Delete this workout plan? This cannot be undone.')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('workout_plans').delete().eq('id', id)
    router.push('/workouts')
  }

  const toggleSession = (i: number) => {
    setExpandedSessions((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 bg-slate-800" />
        <Skeleton className="h-32 bg-slate-800" />
        <Skeleton className="h-32 bg-slate-800" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Workout not found.</p>
        <Link href="/workouts" className="text-violet-400 hover:underline mt-2 block">
          Back to workouts
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <Link href="/workouts" className="mt-1 text-slate-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {plan.source === 'ai_generated' ? (
                <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs">
                  ✨ AI Generated
                </Badge>
              ) : (
                <Badge variant="outline" className="border-white/20 text-slate-400 text-xs">
                  Manual
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{plan.title}</h1>
            {plan.description && (
              <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {plan.weeks} week{plan.weeks !== 1 ? 's' : ''}
              </span>
              <span>{plan.days_per_week} days/week</span>
              <span>{plan.sessions?.length || 0} sessions</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/workouts/${id}/log`}>
            <Button className="bg-violet-500 hover:bg-violet-600 text-white" size="sm">
              <Play className="h-3.5 w-3.5 mr-1.5" />
              Start workout
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={deletePlan}
            disabled={deleting}
            className="text-slate-500 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* AI prompt reminder */}
      {plan.source === 'ai_generated' && plan.ai_prompt && (
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg px-4 py-3 mb-6 text-sm text-violet-300">
          <span className="text-violet-500 font-medium">Your request:</span> {plan.ai_prompt}
        </div>
      )}

      {/* Sessions */}
      <div className="space-y-3">
        {plan.sessions?.map((session, i) => (
          <Card key={i} className="bg-slate-800/50 border-white/10 text-white">
            <button
              className="w-full flex items-center justify-between px-4 py-3"
              onClick={() => toggleSession(i)}
            >
              <div className="text-left">
                <h3 className="font-semibold">Day {session.day}: {session.focus}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{session.exercises.length} exercises</p>
              </div>
              {expandedSessions[i] ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {expandedSessions[i] && (
              <CardContent className="pt-0 px-4 pb-4">
                <div className="border-t border-white/5 pt-3 space-y-2">
                  {session.exercises.map((ex, ei) => (
                    <div key={ei} className="flex items-start justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{ex.exercise?.name || (ex as { name?: string }).name || 'Exercise'}</p>
                        {ex.notes && <p className="text-xs text-slate-500 mt-0.5">{ex.notes}</p>}
                      </div>
                      <div className="text-right text-sm ml-4 flex-shrink-0">
                        <span className="text-white font-medium">{ex.sets} × {ex.reps}</span>
                        <p className="text-xs text-slate-500">{ex.rest_seconds}s rest</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Start workout CTA */}
      <div className="mt-8 text-center">
        <Link href={`/workouts/${id}/log`}>
          <Button size="lg" className="bg-violet-500 hover:bg-violet-600 text-white px-10">
            <Play className="h-4 w-4 mr-2" />
            Start this workout
          </Button>
        </Link>
      </div>
    </div>
  )
}
