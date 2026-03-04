import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const maxDuration = 300

const IMAGE_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises'

// free-exercise-db schema (github.com/yuhonas/free-exercise-db)
interface FreeExercise {
  id: string
  name: string
  force: string | null
  level: string         // beginner | intermediate | expert
  mechanic: string | null
  equipment: string | null
  primaryMuscles: string[]
  secondaryMuscles: string[]
  instructions: string[]
  category: string
  images: string[]      // e.g. ["3_4_Sit-Up/0.jpg", "3_4_Sit-Up/1.jpg"]
}

function mapLevel(level: string): string {
  if (level === 'expert') return 'advanced'
  if (level === 'intermediate') return 'intermediate'
  return 'beginner'
}

function mapEquipment(eq: string | null): string {
  if (!eq) return 'bodyweight'
  const map: Record<string, string> = {
    'barbell': 'barbell',
    'dumbbell': 'dumbbells',
    'cable': 'cable_machine',
    'kettlebells': 'kettlebell',
    'bands': 'resistance_bands',
    'medicine ball': 'medicine_ball',
    'ez curl bar': 'ez_bar',
    'machine': 'machine',
    'body only': 'bodyweight',
    'other': 'bodyweight',
    'foam roll': 'foam_roller',
    'e-z curl bar': 'ez_bar',
    'exercise ball': 'stability_ball',
  }
  return map[eq.toLowerCase()] ?? eq.toLowerCase().replace(/\s+/g, '_')
}

function mapMuscle(m: string): string {
  const map: Record<string, string> = {
    'chest': 'chest',
    'middle back': 'back',
    'lower back': 'back',
    'upper back': 'back',
    'lats': 'back',
    'traps': 'traps',
    'shoulders': 'shoulders',
    'front delts': 'shoulders',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'forearms': 'forearms',
    'quadriceps': 'quads',
    'hamstrings': 'hamstrings',
    'glutes': 'glutes',
    'calves': 'calves',
    'abductors': 'glutes',
    'adductors': 'inner_thighs',
    'abdominals': 'abs',
    'obliques': 'obliques',
    'hip flexors': 'hip_flexors',
    'cardiovascular system': 'cardio',
    'neck': 'neck',
  }
  return map[m.toLowerCase()] ?? m.toLowerCase().replace(/\s+/g, '_')
}

function categoryToBodyPart(category: string, primaryMuscles: string[]): string {
  const catMap: Record<string, string> = {
    'cardio': 'cardio',
    'olympic weightlifting': 'back',
    'powerlifting': 'back',
    'strongman': 'back',
    'stretching': 'waist',
    'plyometrics': 'upper legs',
  }
  if (catMap[category.toLowerCase()]) return catMap[category.toLowerCase()]

  // Infer from primary muscles
  const primary = primaryMuscles[0]?.toLowerCase() ?? ''
  if (['chest'].includes(primary)) return 'chest'
  if (['middle back', 'lower back', 'upper back', 'lats', 'traps'].includes(primary)) return 'back'
  if (['shoulders', 'front delts'].includes(primary)) return 'shoulders'
  if (['biceps', 'triceps', 'forearms'].includes(primary)) return 'upper arms'
  if (['quadriceps', 'hamstrings', 'glutes', 'adductors', 'abductors'].includes(primary)) return 'upper legs'
  if (['calves'].includes(primary)) return 'lower legs'
  if (['abdominals', 'obliques', 'hip flexors'].includes(primary)) return 'waist'
  if (['neck'].includes(primary)) return 'neck'
  return 'back'
}

export async function POST(request: Request) {
  // Verify admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: profile } = await admin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Parse uploaded JSON
  let exercises: FreeExercise[]
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    const text = await file.text()
    exercises = JSON.parse(text)

    if (!Array.isArray(exercises)) {
      return NextResponse.json({ error: 'Invalid JSON — expected an array' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to parse JSON file' }, { status: 400 })
  }

  // Transform and upsert in batches of 50
  const results = { inserted: 0, errors: 0, errorDetails: [] as string[] }
  const batchSize = 50

  for (let i = 0; i < exercises.length; i += batchSize) {
    const batch = exercises.slice(i, i + batchSize).map((ex) => {
      const bodyPart = categoryToBodyPart(ex.category, ex.primaryMuscles)
      const primaryMapped = ex.primaryMuscles.map(mapMuscle)
      const secondaryMapped = ex.secondaryMuscles.map(mapMuscle)

      // Build image URLs from the images array
      // images[0] = rest/start position, images[1] = contracted position
      const imageUrl = ex.images.length > 0
        ? `${IMAGE_BASE}/${ex.images[0]}`
        : null
      const image2Url = ex.images.length > 1
        ? `${IMAGE_BASE}/${ex.images[1]}`
        : null

      return {
        exercise_db_id: `freedb_${ex.id}`,
        name: ex.name,
        body_part: bodyPart,
        target_muscle: primaryMapped[0] ?? 'back',
        muscle_groups: [...new Set([...primaryMapped, ...secondaryMapped.slice(0, 2)])],
        secondary_muscles: secondaryMapped,
        equipment: [mapEquipment(ex.equipment)],
        difficulty: mapLevel(ex.level),
        instructions: ex.instructions.join('\n'),
        description: null,
        gif_url: imageUrl,       // start position image
        video_url: image2Url,    // contracted position image (repurposed field)
      }
    })

    const { error } = await admin
      .from('exercises')
      .upsert(batch, { onConflict: 'exercise_db_id', ignoreDuplicates: false })

    if (error) {
      console.error('Batch error:', error)
      results.errors += batch.length
      results.errorDetails.push(error.message)
    } else {
      results.inserted += batch.length
    }
  }

  return NextResponse.json({
    success: true,
    total_parsed: exercises.length,
    inserted: results.inserted,
    errors: results.errors,
    ...(results.errorDetails.length > 0 && { errorDetails: [...new Set(results.errorDetails)] }),
  })
}
