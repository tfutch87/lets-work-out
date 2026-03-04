import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const muscle = searchParams.get('muscle')
  const bodyPart = searchParams.get('body_part')
  const equipment = searchParams.get('equipment')
  const difficulty = searchParams.get('difficulty')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = await createClient()

  let query = supabase
    .from('exercises')
    .select('*')
    .order('name')
    .range(offset, offset + limit - 1)

  if (muscle) {
    query = query.contains('muscle_groups', [muscle])
  }
  if (bodyPart) {
    query = query.eq('body_part', bodyPart)
  }
  if (equipment) {
    query = query.contains('equipment', [equipment])
  }
  if (difficulty) {
    query = query.eq('difficulty', difficulty)
  }
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
