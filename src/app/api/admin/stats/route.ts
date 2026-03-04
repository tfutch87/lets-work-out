import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Use service role for cross-user queries
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    { count: totalUsers },
    { count: totalWorkouts },
    { count: totalLogs },
    { data: recentUsers },
    { data: recentLogs },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('workout_plans').select('*', { count: 'exact', head: true }),
    admin.from('workout_logs').select('*', { count: 'exact', head: true }).eq('completed', true),
    admin
      .from('profiles')
      .select('id, name, email, fitness_level, primary_goal, onboarding_complete, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
    admin
      .from('workout_logs')
      .select('id, date, completed, user_id, profiles(name, email), workout_plans(title)')
      .eq('completed', true)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  // Signups per day (last 14 days)
  const { data: signupData } = await admin
    .from('profiles')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 14 * 86400000).toISOString())

  const signupsByDay: Record<string, number> = {}
  for (const row of signupData || []) {
    const day = row.created_at.split('T')[0]
    signupsByDay[day] = (signupsByDay[day] || 0) + 1
  }
  const signupChart = Object.entries(signupsByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return NextResponse.json({
    stats: {
      total_users: totalUsers ?? 0,
      total_workouts: totalWorkouts ?? 0,
      total_completed_logs: totalLogs ?? 0,
    },
    recent_users: recentUsers ?? [],
    recent_logs: recentLogs ?? [],
    signup_chart: signupChart,
  })
}
