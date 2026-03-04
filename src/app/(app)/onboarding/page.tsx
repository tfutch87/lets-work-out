'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ChevronRight, ChevronLeft, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const EQUIPMENT_OPTIONS = [
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'cable_machine', label: 'Cable Machine' },
  { value: 'pull_up_bar', label: 'Pull-up Bar' },
  { value: 'bench', label: 'Bench' },
  { value: 'squat_rack', label: 'Squat Rack' },
  { value: 'resistance_bands', label: 'Resistance Bands' },
  { value: 'bodyweight', label: 'Bodyweight Only' },
]

const GOALS = [
  { value: 'weight_loss', label: '🔥 Lose Weight', desc: 'Burn fat, improve cardio' },
  { value: 'muscle_gain', label: '💪 Build Muscle', desc: 'Strength and hypertrophy' },
  { value: 'endurance', label: '🏃 Improve Endurance', desc: 'Cardio and stamina' },
  { value: 'general_fitness', label: '⚡ General Fitness', desc: 'Overall health and wellness' },
  { value: 'sport_specific', label: '🏆 Sport Specific', desc: 'Train for your sport' },
]

const FITNESS_LEVELS = [
  { value: 'beginner', label: 'Beginner', desc: 'New to structured training or gym' },
  { value: 'intermediate', label: 'Intermediate', desc: '1-3 years of consistent training' },
  { value: 'advanced', label: 'Advanced', desc: '3+ years, strong foundation' },
]

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    gender: '',
    age: '',
    fitness_level: '',
    primary_goal: '',
    equipment_access: [] as string[],
    days_per_week: '3',
  })

  const updateForm = (key: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleEquipment = (val: string) => {
    setForm((prev) => ({
      ...prev,
      equipment_access: prev.equipment_access.includes(val)
        ? prev.equipment_access.filter((e) => e !== val)
        : [...prev.equipment_access, val],
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        name: form.name,
        gender: form.gender,
        age: parseInt(form.age),
        fitness_level: form.fitness_level,
        primary_goal: form.primary_goal,
        equipment_access: form.equipment_access,
        days_per_week: parseInt(form.days_per_week),
        onboarding_complete: true,
      })
      .eq('id', user.id)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const canProceed = () => {
    if (step === 1) return form.name.trim().length > 0
    if (step === 2) return form.gender.length > 0 && form.age.length > 0
    if (step === 3) return form.fitness_level.length > 0
    if (step === 4) return form.primary_goal.length > 0
    if (step === 5) return form.equipment_access.length > 0
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-7 w-7 text-violet-400" />
            <span className="text-2xl font-bold">LetsWorkOut</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Let&apos;s set you up</h1>
          <p className="text-slate-400">Quick setup so we can personalize everything for you</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all',
                i < step ? 'bg-violet-500' : 'bg-white/10'
              )}
            />
          ))}
        </div>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardContent className="pt-6 pb-8 px-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-md px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">What&apos;s your name?</h2>
                  <p className="text-slate-400 text-sm">How should we address you?</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Alex Johnson"
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Step 2: Demographics */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Tell us a bit about you</h2>
                  <p className="text-slate-400 text-sm">Helps us tailor your plans appropriately</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Gender</Label>
                  <div className="flex gap-2 flex-wrap">
                    {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((g) => (
                      <button
                        key={g}
                        onClick={() => updateForm('gender', g.toLowerCase())}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm border transition-all',
                          form.gender === g.toLowerCase()
                            ? 'bg-violet-500 border-violet-500 text-white'
                            : 'border-white/20 text-slate-400 hover:border-white/40 hover:text-white'
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-slate-300">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    min={13}
                    max={100}
                    value={form.age}
                    onChange={(e) => updateForm('age', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 w-32"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Fitness Level */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">What&apos;s your fitness level?</h2>
                  <p className="text-slate-400 text-sm">Be honest — this helps us set the right difficulty</p>
                </div>
                <div className="space-y-2">
                  {FITNESS_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => updateForm('fitness_level', level.value)}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-lg border transition-all',
                        form.fitness_level === level.value
                          ? 'bg-violet-500/20 border-violet-500 text-white'
                          : 'border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5'
                      )}
                    >
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm text-slate-400 mt-0.5">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Goal */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">What&apos;s your primary goal?</h2>
                  <p className="text-slate-400 text-sm">Your AI workouts will be optimized for this</p>
                </div>
                <div className="space-y-2">
                  {GOALS.map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => updateForm('primary_goal', goal.value)}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-lg border transition-all',
                        form.primary_goal === goal.value
                          ? 'bg-violet-500/20 border-violet-500 text-white'
                          : 'border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5'
                      )}
                    >
                      <div className="font-medium">{goal.label}</div>
                      <div className="text-sm text-slate-400 mt-0.5">{goal.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Equipment + Days */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Equipment & schedule</h2>
                  <p className="text-slate-400 text-sm">Select all equipment you have access to</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENT_OPTIONS.map((eq) => (
                    <button
                      key={eq.value}
                      onClick={() => toggleEquipment(eq.value)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm border transition-all',
                        form.equipment_access.includes(eq.value)
                          ? 'bg-violet-500 border-violet-500 text-white'
                          : 'border-white/20 text-slate-400 hover:border-white/40 hover:text-white'
                      )}
                    >
                      {eq.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">How many days per week can you train?</Label>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5, 6].map((d) => (
                      <button
                        key={d}
                        onClick={() => updateForm('days_per_week', d.toString())}
                        className={cn(
                          'w-10 h-10 rounded-full text-sm border font-medium transition-all',
                          form.days_per_week === d.toString()
                            ? 'bg-violet-500 border-violet-500 text-white'
                            : 'border-white/20 text-slate-400 hover:border-white/40 hover:text-white'
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Navigation */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className="text-slate-400 hover:text-white"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>

            {step < TOTAL_STEPS ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="bg-violet-500 hover:bg-violet-600 text-white"
              >
                Continue
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="bg-violet-500 hover:bg-violet-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Let&apos;s go!
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-6">
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>
    </div>
  )
}
