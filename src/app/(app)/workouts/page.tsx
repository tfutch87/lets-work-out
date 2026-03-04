'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Dumbbell, Zap, Calendar, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { WorkoutPlan } from '@/types'

export default function WorkoutsPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/workouts')
      .then((r) => r.json())
      .then((data) => {
        setPlans(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Workouts</h1>
          <p className="text-slate-400 text-sm mt-1">
            {plans.length} plan{plans.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/workouts/new">
          <Button className="bg-violet-500 hover:bg-violet-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New workout
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 bg-slate-800" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20">
          <Dumbbell className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-300 mb-2">No workouts yet</h2>
          <p className="text-slate-500 mb-6">Create your first workout plan to get started</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/workouts/new?mode=ai">
              <Button className="bg-violet-500 hover:bg-violet-600 text-white">
                <Zap className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
            </Link>
            <Link href="/workouts/new?mode=manual">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 hover:text-white">
                <Plus className="h-4 w-4 mr-2" />
                Build manually
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/workouts/${plan.id}`}>
              <Card className="bg-slate-800/50 border-white/10 text-white hover:bg-slate-800 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${plan.source === 'ai_generated' ? 'bg-violet-500/20' : 'bg-slate-700'}`}>
                      {plan.source === 'ai_generated' ? (
                        <Zap className="h-4 w-4 text-violet-400" />
                      ) : (
                        <Dumbbell className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{plan.title}</h3>
                      {plan.description && (
                        <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">{plan.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {plan.weeks} week{plan.weeks !== 1 ? 's' : ''}
                        </span>
                        <span>{plan.days_per_week} days/week</span>
                        <Badge variant="outline" className={`text-xs border-0 px-0 ${plan.source === 'ai_generated' ? 'text-violet-400' : 'text-slate-400'}`}>
                          {plan.source === 'ai_generated' ? '✨ AI' : 'Manual'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
