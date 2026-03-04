import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { messages } = body // array of { role: 'user' | 'assistant', content: string }

  if (!messages?.length) {
    return NextResponse.json({ error: 'Messages required' }, { status: 400 })
  }

  // Load user context in parallel
  const [
    { data: profile },
    { data: recentLogs },
    { data: recentPlans },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('workout_logs')
      .select('date, duration_minutes, exercises_logged, notes, completed')
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('date', { ascending: false })
      .limit(10),
    supabase
      .from('workout_plans')
      .select('title, source, days_per_week, weeks, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Build a rich context string for the system prompt
  const profileContext = profile ? `
User Profile:
- Name: ${profile.name || 'Unknown'}
- Age: ${profile.age || 'Unknown'}, Gender: ${profile.gender || 'Unknown'}
- Fitness level: ${profile.fitness_level || 'Unknown'}
- Primary goal: ${profile.primary_goal?.replace(/_/g, ' ') || 'Unknown'}
- Equipment access: ${(profile.equipment_access || []).join(', ') || 'Unknown'}
- Training days per week: ${profile.days_per_week || 'Unknown'}
` : 'No profile data available.'

  const logsContext = recentLogs?.length ? `
Recent Workout History (last ${recentLogs.length} sessions):
${recentLogs.map((log, i) => {
  const exercises = (log.exercises_logged || []) as { exercise_name: string; sets: { weight: number | null; reps: number | null; completed: boolean }[] }[]
  const completedSets = exercises.flatMap(e => e.sets).filter(s => s.completed).length
  const topExercises = exercises.slice(0, 4).map(e => e.exercise_name).join(', ')
  return `  ${i + 1}. ${log.date} — ${exercises.length} exercises (${completedSets} sets)${log.duration_minutes ? `, ${log.duration_minutes} min` : ''}${topExercises ? `. Exercises: ${topExercises}` : ''}${log.notes ? `. Notes: ${log.notes}` : ''}`
}).join('\n')}
` : 'No workout history yet.'

  const plansContext = recentPlans?.length ? `
Active Workout Plans:
${recentPlans.map(p => `  - "${p.title}" (${p.source === 'ai_generated' ? 'AI generated' : 'manual'}, ${p.days_per_week}x/week, ${p.weeks} week${p.weeks !== 1 ? 's' : ''})`).join('\n')}
` : 'No workout plans created yet.'

  // Personal records summary from logs
  const prMap: Record<string, number> = {}
  for (const log of recentLogs || []) {
    for (const ex of (log.exercises_logged || []) as { exercise_name: string; sets: { weight: number | null; completed: boolean }[] }[]) {
      for (const set of ex.sets) {
        if (set.completed && set.weight) {
          if (!prMap[ex.exercise_name] || set.weight > prMap[ex.exercise_name]) {
            prMap[ex.exercise_name] = set.weight
          }
        }
      }
    }
  }
  const prContext = Object.keys(prMap).length
    ? `Recent PRs: ${Object.entries(prMap).slice(0, 6).map(([e, w]) => `${e}: ${w}kg`).join(', ')}`
    : ''

  const systemPrompt = `You are an expert AI fitness coach inside LetsWorkOut, a personal training app. You have full context of this user's fitness profile, history, and goals. Give specific, personalized advice — never generic. Be direct, supportive, and knowledgeable.

${profileContext}
${logsContext}
${plansContext}
${prContext}

Guidelines:
- Reference the user's actual data when relevant (their goal, recent workouts, PRs, equipment)
- For injury or medical concerns, recommend seeing a professional but still provide helpful general guidance
- Keep responses concise but thorough — use short paragraphs, not walls of text
- Use bullet points sparingly, only when listing multiple distinct items
- Be encouraging but honest — if they're overtraining or have a gap in their programming, say so
- Don't make up workout data you don't have — work with what's provided`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const reply = response.content[0]
    if (reply.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response' }, { status: 500 })
    }

    return NextResponse.json({ reply: reply.text })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
