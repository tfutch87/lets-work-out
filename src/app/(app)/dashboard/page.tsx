import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Zap, Dumbbell, TrendingUp, Plus, ArrowRight, Flame, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Redirect to onboarding if not complete
  if (profile && !profile.onboarding_complete) {
    redirect('/onboarding')
  }

  // Fetch recent workouts
  const { data: recentPlans } = await supabase
    .from('workout_plans')
    .select('id, title, source, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch recent logs
  const { data: recentLogs } = await supabase
    .from('workout_logs')
    .select('id, date, completed, plan_id, workout_plans(title)')
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('date', { ascending: false })
    .limit(5)

  const firstName = profile?.name?.split(' ')[0] || 'there'
  const totalLogs = recentLogs?.length ?? 0

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Hey, {firstName} 👋</h1>
        <p className="text-slate-400 mt-1">
          {totalLogs === 0
            ? "Ready to start your first workout?"
            : `${totalLogs} session${totalLogs !== 1 ? 's' : ''} logged. Keep it up!`}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link href="/workouts/new?mode=ai" className="block">
          <Card className="bg-gradient-to-br from-violet-600 to-violet-800 border-0 text-white h-full hover:opacity-90 transition-opacity cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-white/20 rounded-xl p-3">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Generate with AI</h3>
                <p className="text-violet-200 text-sm">Describe your goal, get a plan</p>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto opacity-70" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/workouts/new?mode=manual" className="block">
          <Card className="bg-slate-800 border-white/10 text-white h-full hover:bg-slate-700 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-slate-700 rounded-xl p-3">
                <Dumbbell className="h-6 w-6 text-slate-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Build manually</h3>
                <p className="text-slate-400 text-sm">Choose your own exercises</p>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto text-slate-500" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent workout plans */}
        <Card className="bg-slate-800/50 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">My Workouts</CardTitle>
            <Link href="/workouts" className="text-violet-400 hover:text-violet-300 text-sm">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {!recentPlans || recentPlans.length === 0 ? (
              <div className="text-center py-6">
                <Dumbbell className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                <p className="text-slate-500 text-sm">No workout plans yet</p>
                <Link href="/workouts/new" className="mt-3 inline-block">
                  <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create first workout
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentPlans.map((plan) => (
                  <Link key={plan.id} href={`/workouts/${plan.id}`}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                      <div className={`p-1.5 rounded-md ${plan.source === 'ai_generated' ? 'bg-violet-500/20' : 'bg-slate-700'}`}>
                        {plan.source === 'ai_generated'
                          ? <Zap className="h-3.5 w-3.5 text-violet-400" />
                          : <Dumbbell className="h-3.5 w-3.5 text-slate-400" />}
                      </div>
                      <span className="text-sm font-medium truncate">{plan.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-600 ml-auto flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="bg-slate-800/50 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" />
              Recent Activity
            </CardTitle>
            <Link href="/progress" className="text-violet-400 hover:text-violet-300 text-sm">
              See progress
            </Link>
          </CardHeader>
          <CardContent>
            {!recentLogs || recentLogs.length === 0 ? (
              <div className="text-center py-6">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                <p className="text-slate-500 text-sm">No workouts logged yet</p>
                <p className="text-slate-600 text-xs mt-1">Complete a session to track progress</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentLogs.map((log) => {
                  const planTitle = (log as { workout_plans?: { title?: string } }).workout_plans?.title
                  return (
                    <div key={log.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                      <div className="bg-emerald-500/20 p-1.5 rounded-md">
                        <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{planTitle || 'Workout'}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">Done ✓</span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile summary */}
      {profile && (
        <Card className="bg-slate-800/20 border-white/5 text-white mt-6">
          <CardContent className="p-4 flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Goal</p>
              <p className="text-sm font-medium mt-0.5 capitalize">{profile.primary_goal?.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Level</p>
              <p className="text-sm font-medium mt-0.5 capitalize">{profile.fitness_level}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Training days</p>
              <p className="text-sm font-medium mt-0.5">{profile.days_per_week}x per week</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Equipment</p>
              <p className="text-sm font-medium mt-0.5 capitalize">
                {profile.equipment_access?.slice(0, 3).join(', ').replace(/_/g, ' ')}
                {(profile.equipment_access?.length ?? 0) > 3 ? ` +${profile.equipment_access!.length - 3}` : ''}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
