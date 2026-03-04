import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Allow up to 5 minutes — paginated sync across many API calls takes time
export const maxDuration = 300

// Map ExerciseDB equipment names to our format
function mapEquipment(eq: string): string {
  const map: Record<string, string> = {
    'body weight': 'bodyweight',
    'barbell': 'barbell',
    'dumbbell': 'dumbbells',
    'cable': 'cable_machine',
    'kettlebell': 'kettlebell',
    'band': 'resistance_bands',
    'medicine ball': 'medicine_ball',
    'ez barbell': 'ez_bar',
    'olympic barbell': 'barbell',
    'trap bar': 'barbell',
    'resistance band': 'resistance_bands',
    'roller': 'foam_roller',
    'assisted': 'assisted_machine',
    'leverage machine': 'machine',
    'smith machine': 'smith_machine',
    'upper body ergometer': 'machine',
    'weighted': 'bodyweight',
    'bosu ball': 'bosu_ball',
    'stability ball': 'stability_ball',
    'skierg machine': 'machine',
    'sled machine': 'machine',
    'hammer': 'dumbbells',
    'tire': 'tire',
    'rope': 'rope',
    'wheel roller': 'ab_wheel',
  }
  return map[eq.toLowerCase()] || eq.toLowerCase().replace(/\s+/g, '_')
}

// Map ExerciseDB muscle names to our format
function mapMuscle(m: string): string {
  const map: Record<string, string> = {
    'pectorals': 'chest',
    'upper chest': 'chest',
    'chest': 'chest',
    'lats': 'back',
    'upper back': 'back',
    'traps': 'traps',
    'spine': 'back',
    'serratus anterior': 'back',
    'delts': 'shoulders',
    'front delts': 'shoulders',
    'rear delts': 'rear_delts',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'forearms': 'forearms',
    'brachialis': 'biceps',
    'brachioradialis': 'forearms',
    'quads': 'quads',
    'hamstrings': 'hamstrings',
    'glutes': 'glutes',
    'calves': 'calves',
    'abductors': 'glutes',
    'adductors': 'inner_thighs',
    'abs': 'abs',
    'obliques': 'obliques',
    'lower back': 'back',
    'levator scapulae': 'back',
    'hip flexors': 'hip_flexors',
    'cardiovascular system': 'cardio',
    'rhomboids': 'back',
    'shoulders': 'shoulders',
    'quadriceps': 'quads',
  }
  return map[m.toLowerCase()] || m.toLowerCase().replace(/\s+/g, '_')
}

// ExerciseDB API v2 response shape (no gifUrl — uses description, difficulty, category instead)
interface ExerciseDBExercise {
  id: string
  name: string
  bodyPart: string
  equipment: string
  target: string
  secondaryMuscles: string[]
  instructions: string[]
  description?: string
  difficulty?: string
  category?: string
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify admin
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

  const results = { inserted: 0, errors: 0, errorDetails: [] as string[] }

  const rapidApiHeaders = {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  }

  try {
    // Strategy: fetch by each body part separately to bypass the global cap.
    // The /exercises/bodyPart/{bodyPart} endpoint is not subject to the same
    // total-result limit as /exercises, so we get full coverage.

    // Step 1: get the list of body parts
    const bodyPartRes = await fetch(
      'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
      { headers: rapidApiHeaders }
    )
    if (!bodyPartRes.ok) {
      const text = await bodyPartRes.text()
      return NextResponse.json(
        { error: `ExerciseDB bodyPartList error: ${bodyPartRes.status} — ${text}` },
        { status: 500 }
      )
    }
    const bodyParts: string[] = await bodyPartRes.json()

    // Step 2: fetch exercises for each body part with a high limit + delay to avoid rate limiting
    const seenIds = new Set<string>()
    const allExercises: ExerciseDBExercise[] = []
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

    for (const bodyPart of bodyParts) {
      let offset = 0
      const PER_PAGE = 500

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const res = await fetch(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=${PER_PAGE}&offset=${offset}`,
          { headers: rapidApiHeaders }
        )

        if (!res.ok) {
          console.warn(`Failed for bodyPart ${bodyPart} at offset ${offset}: ${res.status}`)
          break
        }

        const page: ExerciseDBExercise[] = await res.json()
        if (!Array.isArray(page) || page.length === 0) break

        for (const ex of page) {
          if (!seenIds.has(ex.id)) {
            seenIds.add(ex.id)
            allExercises.push(ex)
          }
        }

        if (page.length < PER_PAGE) break  // last page for this body part
        offset += PER_PAGE

        await sleep(500) // 500ms between paginated requests
      }

      await sleep(300) // 300ms between body parts to respect rate limits
    }

    const exercises = allExercises

    if (exercises.length === 0) {
      return NextResponse.json({ error: 'No exercises returned from API' }, { status: 500 })
    }

    // Upsert in batches of 50
    const batchSize = 50
    for (let i = 0; i < exercises.length; i += batchSize) {
      const batch = exercises.slice(i, i + batchSize).map((ex) => ({
        exercise_db_id: ex.id,
        name: ex.name.charAt(0).toUpperCase() + ex.name.slice(1),
        body_part: ex.bodyPart,
        target_muscle: mapMuscle(ex.target),
        muscle_groups: [
          mapMuscle(ex.target),
          ...ex.secondaryMuscles.slice(0, 3).map(mapMuscle),
        ].filter((v, idx, a) => a.indexOf(v) === idx), // dedupe
        secondary_muscles: ex.secondaryMuscles.map(mapMuscle),
        equipment: [mapEquipment(ex.equipment)],
        // Use API difficulty if provided, otherwise infer from category/equipment
        difficulty: ex.difficulty ?? inferDifficulty(ex.category ?? '', ex.equipment),
        instructions: ex.instructions.join('\n'),
        description: ex.description ?? null,
        // gif_url and video_url not available in this API version
        gif_url: null,
        video_url: null,
      }))

      const { error } = await admin
        .from('exercises')
        .upsert(batch, { onConflict: 'exercise_db_id', ignoreDuplicates: false })

      if (error) {
        console.error('Batch upsert error:', error)
        results.errors += batch.length
        results.errorDetails.push(error.message)
      } else {
        results.inserted += batch.length
      }
    }

    return NextResponse.json({
      success: true,
      total_fetched: exercises.length,
      inserted: results.inserted,
      errors: results.errors,
      ...(results.errorDetails.length > 0 && { errorDetails: results.errorDetails }),
    })
  } catch (err) {
    console.error('Sync error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sync failed' },
      { status: 500 }
    )
  }
}

// Infer difficulty from API category field or equipment
function inferDifficulty(category: string, equipment: string): string {
  const cat = category.toLowerCase()
  const eq = equipment.toLowerCase()
  if (cat === 'olympic weightlifting' || eq.includes('olympic') || eq.includes('trap bar')) return 'advanced'
  if (cat === 'plyometrics' || cat === 'strongman') return 'advanced'
  if (eq === 'body weight' || eq === 'band' || eq === 'resistance band') return 'beginner'
  return 'intermediate'
}
