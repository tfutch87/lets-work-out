'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Flame, Dumbbell, Trophy, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ProgressSummary } from '@/types'

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/progress')
      .then((r) => r.json())
      .then((data) => {
        setProgress(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40 bg-slate-800" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 bg-slate-800" />
          ))}
        </div>
        <Skeleton className="h-64 bg-slate-800" />
      </div>
    )
  }

  const stats = [
    {
      label: 'Current Streak',
      value: `${progress?.streak ?? 0}`,
      unit: 'days',
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Total Workouts',
      value: `${progress?.total_workouts ?? 0}`,
      unit: 'sessions',
      icon: Dumbbell,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'This Week',
      value: `${progress?.workouts_this_week ?? 0}`,
      unit: 'sessions',
      icon: Calendar,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
    {
      label: 'Personal Records',
      value: `${progress?.personal_records?.length ?? 0}`,
      unit: 'exercises',
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ]

  const hasHistory = (progress?.weekly_volume?.length ?? 0) > 0
  const hasWorkouts = (progress?.total_workouts ?? 0) > 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-slate-400 text-sm mt-1">Your fitness journey at a glance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="bg-slate-800/50 border-white/10 text-white">
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-3`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">{stat.value}</span>
                  <span className="text-slate-500 text-sm mb-1">{stat.unit}</span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!hasWorkouts ? (
        <Card className="bg-slate-800/50 border-white/10 text-white">
          <CardContent className="py-16 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-slate-600" />
            <p className="text-lg font-semibold text-slate-300">No workout data yet</p>
            <p className="text-slate-500 text-sm mt-1">Log your first workout to see progress charts and personal records</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Weekly volume chart */}
          {hasHistory && (
            <Card className="bg-slate-800/50 border-white/10 text-white mb-6">
              <CardHeader>
                <CardTitle className="text-base">Weekly Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={progress?.weekly_volume}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="week"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickFormatter={(v) => {
                        const d = new Date(v)
                        return `${d.getMonth() + 1}/${d.getDate()}`
                      }}
                    />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                      labelStyle={{ color: '#94a3b8' }}
                      itemStyle={{ color: '#a78bfa' }}
                      formatter={(value) => [`${Number(value).toLocaleString()} kg·reps`, 'Volume']}
                    />
                    <Bar dataKey="volume" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Personal Records */}
          {(progress?.personal_records?.length ?? 0) > 0 && (
            <Card className="bg-slate-800/50 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Personal Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {progress?.personal_records?.map((pr, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{pr.exercise_name}</p>
                        <p className="text-xs text-slate-500">{new Date(pr.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        {pr.max_weight > 0 && (
                          <p className="text-sm font-bold text-amber-400">{pr.max_weight} kg</p>
                        )}
                        {pr.max_reps > 0 && (
                          <p className="text-xs text-slate-400">{pr.max_reps} reps</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
