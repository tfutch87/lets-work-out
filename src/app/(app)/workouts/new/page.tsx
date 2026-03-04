'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Zap, Dumbbell, Loader2, Plus, Trash2, GripVertical, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Exercise, WorkoutSession, AIGeneratedPlan } from '@/types'

const EXAMPLE_PROMPTS = [
  'Training for a marathon, 16 weeks out, 4 days/week',
  "I'm a woman, want to grow glutes without adding bulk",
  '30 minutes no equipment full body HIIT, 3 days/week',
  'Powerlifting beginner program, I have a barbell and squat rack',
  'Upper/lower split, intermediate, 4 days/week muscle building',
]

interface ManualExercise {
  tempId: string
  exercise?: Exercise
  name: string
  sets: number
  reps: string
  rest_seconds: number
  notes: string
}

export default function NewWorkoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultMode = searchParams.get('mode') === 'manual' ? 'manual' : 'ai'

  // AI mode state
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPlan, setAiPlan] = useState<AIGeneratedPlan | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  // Manual mode state
  const [manualTitle, setManualTitle] = useState('')
  const [manualExercises, setManualExercises] = useState<ManualExercise[]>([])
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [exerciseResults, setExerciseResults] = useState<Exercise[]>([])
  const [showSearch, setShowSearch] = useState(false)

  const [saving, setSaving] = useState(false)

  // Search exercises for manual builder
  useEffect(() => {
    if (!exerciseSearch) {
      setExerciseResults([])
      return
    }
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/exercises?search=${encodeURIComponent(exerciseSearch)}`)
      const data = await res.json()
      setExerciseResults(Array.isArray(data) ? data.slice(0, 8) : [])
    }, 300)
    return () => clearTimeout(timeout)
  }, [exerciseSearch])

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiError(null)
    setAiPlan(null)

    try {
      const res = await fetch('/api/workouts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setAiPlan(data)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setAiLoading(false)
    }
  }

  const saveAIPlan = async () => {
    if (!aiPlan) return
    setSaving(true)
    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: aiPlan.title,
        description: aiPlan.description,
        source: 'ai_generated',
        ai_prompt: aiPrompt,
        weeks: aiPlan.weeks,
        days_per_week: aiPlan.days_per_week,
        sessions: aiPlan.sessions,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/workouts/${data.id}`)
    }
    setSaving(false)
  }

  const addExerciseToManual = (ex: Exercise) => {
    setManualExercises((prev) => [
      ...prev,
      {
        tempId: Math.random().toString(36).slice(2),
        exercise: ex,
        name: ex.name,
        sets: 3,
        reps: '8-12',
        rest_seconds: 90,
        notes: '',
      },
    ])
    setExerciseSearch('')
    setExerciseResults([])
    setShowSearch(false)
  }

  const updateManualExercise = (tempId: string, key: string, value: string | number) => {
    setManualExercises((prev) =>
      prev.map((e) => (e.tempId === tempId ? { ...e, [key]: value } : e))
    )
  }

  const removeManualExercise = (tempId: string) => {
    setManualExercises((prev) => prev.filter((e) => e.tempId !== tempId))
  }

  const saveManualPlan = async () => {
    if (!manualTitle || manualExercises.length === 0) return
    setSaving(true)

    const sessions: WorkoutSession[] = [
      {
        day: 1,
        focus: 'Custom Workout',
        exercises: manualExercises.map((e, i) => ({
          exercise_id: e.exercise?.id || '',
          exercise: e.exercise,
          sets: e.sets,
          reps: e.reps,
          rest_seconds: e.rest_seconds,
          notes: e.notes,
          order_index: i,
        })),
      },
    ]

    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: manualTitle,
        source: 'manual',
        weeks: 1,
        days_per_week: 1,
        sessions,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/workouts/${data.id}`)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Workout</h1>
        <p className="text-slate-400 text-sm mt-1">Build manually or let AI create your plan</p>
      </div>

      <Tabs defaultValue={defaultMode}>
        <TabsList className="bg-slate-800 border border-white/10 mb-6">
          <TabsTrigger value="ai" className="data-[state=active]:bg-violet-500 data-[state=active]:text-white text-slate-400">
            <Zap className="h-4 w-4 mr-2" />
            AI Builder
          </TabsTrigger>
          <TabsTrigger value="manual" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400">
            <Dumbbell className="h-4 w-4 mr-2" />
            Manual Builder
          </TabsTrigger>
        </TabsList>

        {/* AI Builder */}
        <TabsContent value="ai">
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-white/10 text-white">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Describe your goal or workout</Label>
                  <Textarea
                    placeholder="e.g. 'Training for a marathon 16 weeks out, 4 days/week' or 'I want to build glutes without bulk, I have dumbbells and a bench'"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={3}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 resize-none"
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2">Examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setAiPrompt(p)}
                        className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white px-2.5 py-1 rounded-full transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                {aiError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-md px-4 py-3 text-sm">
                    {aiError}
                  </div>
                )}
                <Button
                  onClick={generateWithAI}
                  disabled={!aiPrompt.trim() || aiLoading}
                  className="w-full bg-violet-500 hover:bg-violet-600 text-white"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating your plan...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate workout plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI Result Preview */}
            {aiPlan && (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{aiPlan.title}</h2>
                    {aiPlan.description && (
                      <p className="text-slate-400 text-sm mt-1">{aiPlan.description}</p>
                    )}
                    <div className="flex gap-3 mt-2 text-xs text-slate-500">
                      <span>{aiPlan.weeks} week{aiPlan.weeks !== 1 ? 's' : ''}</span>
                      <span>·</span>
                      <span>{aiPlan.days_per_week} days/week</span>
                      <span>·</span>
                      <span>{aiPlan.sessions?.reduce((acc, s) => acc + s.exercises.length, 0)} exercises</span>
                    </div>
                  </div>
                  <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">✨ AI Generated</Badge>
                </div>

                {aiPlan.sessions?.map((session, si) => (
                  <Card key={si} className="bg-slate-800/50 border-white/10 text-white">
                    <CardHeader className="pb-3 pt-4 px-4">
                      <CardTitle className="text-base">Day {session.day}: {session.focus}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {session.exercises.map((ex, ei) => (
                          <div key={ei} className="flex items-start justify-between py-2 border-b border-white/5 last:border-0">
                            <div>
                              <p className="font-medium text-sm">{ex.name}</p>
                              {ex.notes && <p className="text-xs text-slate-500 mt-0.5">{ex.notes}</p>}
                            </div>
                            <div className="text-right text-sm text-slate-400 ml-4 flex-shrink-0">
                              <span className="text-white font-medium">{ex.sets} × {ex.reps}</span>
                              <p className="text-xs">{ex.rest_seconds}s rest</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-3">
                  <Button
                    onClick={saveAIPlan}
                    disabled={saving}
                    className="flex-1 bg-violet-500 hover:bg-violet-600 text-white"
                  >
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save this plan
                  </Button>
                  <Button
                    onClick={() => { setAiPlan(null); setAiPrompt('') }}
                    variant="outline"
                    className="border-white/20 text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    Start over
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Manual Builder */}
        <TabsContent value="manual">
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-white/10 text-white">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Workout name</Label>
                  <Input
                    placeholder="e.g. Push Day A, Monday Upper, Full Body Circuit"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Exercise list */}
            {manualExercises.length > 0 && (
              <div className="space-y-3">
                {manualExercises.map((ex) => (
                  <Card key={ex.tempId} className="bg-slate-800/50 border-white/10 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <GripVertical className="h-4 w-4 text-slate-600" />
                        <h4 className="font-medium flex-1">{ex.name}</h4>
                        <button
                          onClick={() => removeManualExercise(ex.tempId)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Sets</label>
                          <Input
                            type="number"
                            min={1}
                            max={20}
                            value={ex.sets}
                            onChange={(e) => updateManualExercise(ex.tempId, 'sets', parseInt(e.target.value))}
                            className="bg-white/5 border-white/10 text-white h-8 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Reps</label>
                          <Input
                            value={ex.reps}
                            onChange={(e) => updateManualExercise(ex.tempId, 'reps', e.target.value)}
                            placeholder="8-12"
                            className="bg-white/5 border-white/10 text-white h-8 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Rest (s)</label>
                          <Input
                            type="number"
                            min={0}
                            value={ex.rest_seconds}
                            onChange={(e) => updateManualExercise(ex.tempId, 'rest_seconds', parseInt(e.target.value))}
                            className="bg-white/5 border-white/10 text-white h-8 text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Input
                          placeholder="Notes (optional)"
                          value={ex.notes}
                          onChange={(e) => updateManualExercise(ex.tempId, 'notes', e.target.value)}
                          className="bg-white/5 border-white/10 text-white h-8 text-sm placeholder:text-slate-600"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add exercise */}
            <Card className="bg-slate-800/50 border-white/10 text-white border-dashed">
              <CardContent className="p-4">
                {showSearch ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        autoFocus
                        placeholder="Search exercises to add..."
                        value={exerciseSearch}
                        onChange={(e) => setExerciseSearch(e.target.value)}
                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                    </div>
                    {exerciseResults.length > 0 && (
                      <div className="space-y-1 max-h-56 overflow-y-auto">
                        {exerciseResults.map((ex) => (
                          <button
                            key={ex.id}
                            onClick={() => addExerciseToManual(ex)}
                            className="w-full text-left px-3 py-2.5 rounded-md hover:bg-white/5 transition-colors"
                          >
                            <p className="font-medium text-sm">{ex.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {ex.muscle_groups.join(', ')} · {ex.difficulty}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setShowSearch(false)}
                      className="text-xs text-slate-500 hover:text-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Add exercise</span>
                  </button>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={saveManualPlan}
              disabled={!manualTitle || manualExercises.length === 0 || saving}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save workout
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
