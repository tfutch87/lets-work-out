'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users, Dumbbell, Trophy, TrendingUp, ArrowLeft,
  ShieldCheck, RefreshCw, CheckCircle, Clock, Download, AlertCircle, Upload
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

interface StatsData {
  stats: {
    total_users: number
    total_workouts: number
    total_completed_logs: number
  }
  recent_users: {
    id: string
    name: string
    email: string
    fitness_level: string
    primary_goal: string
    onboarding_complete: boolean
    created_at: string
  }[]
  recent_logs: {
    id: string
    date: string
    user_id: string
    profiles: { name: string; email: string } | null
    workout_plans: { title: string } | null
  }[]
  signup_chart: { date: string; count: number }[]
}

const goalLabel: Record<string, string> = {
  weight_loss: 'Weight Loss',
  muscle_gain: 'Muscle Gain',
  endurance: 'Endurance',
  general_fitness: 'General Fitness',
  sport_specific: 'Sport Specific',
}

const levelColor: Record<string, string> = {
  beginner: 'bg-emerald-500/20 text-emerald-400',
  intermediate: 'bg-amber-500/20 text-amber-400',
  advanced: 'bg-red-500/20 text-red-400',
}

export default function AdminDashboardClient({ adminName }: { adminName: string }) {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ success?: boolean; total_fetched?: number; inserted?: number; errors?: number; error?: string } | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success?: boolean; total_parsed?: number; inserted?: number; errors?: number; error?: string } | null>(null)

  const fetchStats = async () => {
    setRefreshing(true)
    const res = await fetch('/api/admin/stats')
    const json = await res.json()
    setData(json)
    setLoading(false)
    setRefreshing(false)
  }

  const syncExercises = async () => {
    setSyncing(true)
    setSyncResult(null)
    const res = await fetch('/api/admin/sync-exercises', { method: 'POST' })
    const json = await res.json()
    setSyncResult(json)
    setSyncing(false)
  }

  const importExercises = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setImportResult(null)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/import-exercises', { method: 'POST', body: form })
    const json = await res.json()
    setImportResult(json)
    setImporting(false)
    // Reset input so same file can be re-uploaded if needed
    e.target.value = ''
  }

  useEffect(() => { fetchStats() }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Admin nav */}
      <nav className="border-b border-white/10 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-violet-400" />
              <span className="font-bold">Admin</span>
              <span className="text-slate-500 text-sm hidden sm:inline">— LetsWorkOut</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm hidden sm:block">{adminName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchStats}
              disabled={refreshing}
              className="text-slate-400 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Platform overview and user management</p>
          </div>

          {/* Exercise management */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              {/* JSON file import */}
              <label className={`cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-white/20 text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${importing ? 'opacity-50 pointer-events-none' : ''}`}>
                {importing
                  ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Importing...</>
                  : <><Upload className="h-3.5 w-3.5" /> Import JSON</>
                }
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={importExercises}
                  disabled={importing}
                />
              </label>

              {/* RapidAPI sync */}
              <Button
                onClick={syncExercises}
                disabled={syncing}
                size="sm"
                className="bg-violet-500 hover:bg-violet-600 text-white"
              >
                {syncing ? (
                  <><RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><Download className="h-3.5 w-3.5 mr-2" /> Sync API</>
                )}
              </Button>
            </div>

            {/* Sync result */}
            {syncResult && (
              <div className={`flex items-center gap-1.5 text-xs ${syncResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                {syncResult.success
                  ? <><CheckCircle className="h-3.5 w-3.5" /> {syncResult.total_fetched?.toLocaleString()} fetched, {syncResult.inserted?.toLocaleString()} upserted{syncResult.errors ? `, ${syncResult.errors} errors` : ''}</>
                  : <><AlertCircle className="h-3.5 w-3.5" /> {syncResult.error}</>
                }
              </div>
            )}

            {/* Import result */}
            {importResult && (
              <div className={`flex items-center gap-1.5 text-xs ${importResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                {importResult.success
                  ? <><CheckCircle className="h-3.5 w-3.5" /> {importResult.total_parsed?.toLocaleString()} parsed, {importResult.inserted?.toLocaleString()} imported{importResult.errors ? `, ${importResult.errors} errors` : ''}</>
                  : <><AlertCircle className="h-3.5 w-3.5" /> {importResult.error}</>
                }
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 bg-slate-800" />
              ))}
            </div>
            <Skeleton className="h-64 bg-slate-800" />
            <Skeleton className="h-96 bg-slate-800" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total Users', value: data?.stats.total_users ?? 0, icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10' },
                { label: 'Workout Plans', value: data?.stats.total_workouts ?? 0, icon: Dumbbell, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                { label: 'Sessions Logged', value: data?.stats.total_completed_logs ?? 0, icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((s) => {
                const Icon = s.icon
                return (
                  <Card key={s.label} className="bg-slate-800/50 border-white/10 text-white">
                    <CardContent className="p-5">
                      <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-3`}>
                        <Icon className={`h-5 w-5 ${s.color}`} />
                      </div>
                      <div className="text-3xl font-bold">{s.value.toLocaleString()}</div>
                      <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Signup chart */}
            {(data?.signup_chart?.length ?? 0) > 0 && (
              <Card className="bg-slate-800/50 border-white/10 text-white mb-8">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-violet-400" />
                    New signups — last 14 days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data?.signup_chart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        tickFormatter={(v) => {
                          const d = new Date(v)
                          return `${d.getMonth() + 1}/${d.getDate()}`
                        }}
                      />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                        labelStyle={{ color: '#94a3b8' }}
                        itemStyle={{ color: '#a78bfa' }}
                      />
                      <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Signups" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent users */}
              <Card className="bg-slate-800/50 border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-sky-400" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(data?.recent_users?.length ?? 0) === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-6">No users yet</p>
                  ) : (
                    <div className="space-y-3">
                      {data?.recent_users.map((u) => (
                        <div key={u.id} className="flex items-start justify-between gap-3 py-2 border-b border-white/5 last:border-0">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{u.name || '—'}</p>
                              {!u.onboarding_complete && (
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> setup
                                </span>
                              )}
                              {u.onboarding_complete && (
                                <CheckCircle className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate">{u.email}</p>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {u.fitness_level && (
                              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${levelColor[u.fitness_level] || 'bg-slate-700 text-slate-400'}`}>
                                {u.fitness_level}
                              </span>
                            )}
                            {u.primary_goal && (
                              <span className="text-xs text-slate-500">
                                {goalLabel[u.primary_goal] || u.primary_goal}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent workout sessions */}
              <Card className="bg-slate-800/50 border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-violet-400" />
                    Recent Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(data?.recent_logs?.length ?? 0) === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-6">No sessions logged yet</p>
                  ) : (
                    <div className="space-y-3">
                      {data?.recent_logs.map((log) => (
                        <div key={log.id} className="flex items-start justify-between gap-3 py-2 border-b border-white/5 last:border-0">
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">
                              {log.workout_plans?.title || 'Custom workout'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {(log.profiles as { name?: string; email?: string } | null)?.name || (log.profiles as { email?: string } | null)?.email || 'Unknown user'}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 flex-shrink-0">
                            {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
