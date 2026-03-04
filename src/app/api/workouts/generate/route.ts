import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get user profile for context
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const body = await request.json()
  const { prompt } = body

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  const systemPrompt = `You are an expert personal trainer and exercise scientist. Generate a personalized workout plan based on the user's profile and request.

Return ONLY valid JSON matching this exact schema (no markdown, no explanation, just raw JSON):
{
  "title": "string",
  "description": "string",
  "weeks": number,
  "days_per_week": number,
  "sessions": [
    {
      "day": number,
      "focus": "string (e.g. 'Upper Body Push', 'Leg Day', 'Full Body')",
      "exercises": [
        {
          "name": "string",
          "sets": number,
          "reps": "string (e.g. '8-10', '12', '30s', 'to failure')",
          "rest_seconds": number,
          "notes": "string (optional form cues or modifications)"
        }
      ]
    }
  ]
}

Guidelines:
- Be specific, progressive, and safe
- Match exercises to available equipment
- Respect fitness level (beginners: simpler movements, lower volume)
- For weight loss: higher reps (12-20), supersets, cardio finishers
- For muscle gain: progressive overload focus, 6-12 rep ranges
- For endurance: longer sessions, circuit-style, cardio included
- Gender-aware: avoid stereotypes, respect stated preferences
- Include warm-up/cool-down notes in exercise notes where appropriate
- Progressive overload: note where users should increase weight each week`

  const userMessage = profile
    ? `Profile: ${profile.age || '?'}yo ${profile.gender || 'person'}, ${profile.fitness_level || 'beginner'} level, goal: ${profile.primary_goal || 'general fitness'}, equipment: ${(profile.equipment_access || ['bodyweight']).join(', ')}, ${profile.days_per_week || 3} days/week available.

User request: "${prompt}"`
    : `User request: "${prompt}"`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: userMessage }],
      system: systemPrompt,
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 })
    }

    // Parse JSON — strip any accidental markdown wrapping
    let jsonText = content.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim()
    }

    const plan = JSON.parse(jsonText)
    return NextResponse.json(plan)
  } catch (parseError) {
    // Retry once with stricter prompt
    try {
      const retryMessage = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        messages: [
          { role: 'user', content: userMessage },
          {
            role: 'assistant',
            content: 'I will return only valid JSON with no markdown formatting:',
          },
        ],
        system: systemPrompt + '\n\nCRITICAL: Return ONLY raw JSON. No ```json wrapping. No text before or after.',
      })

      const retryContent = retryMessage.content[0]
      if (retryContent.type !== 'text') throw new Error('Bad format')

      const plan = JSON.parse(retryContent.text.trim())
      return NextResponse.json(plan)
    } catch {
      return NextResponse.json(
        { error: 'Failed to generate workout plan. Please try again.' },
        { status: 500 }
      )
    }
  }
}
