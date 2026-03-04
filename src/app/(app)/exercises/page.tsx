'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Dumbbell, X, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Exercise } from '@/types'

const BODY_PARTS = ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist']
const EQUIPMENT_LIST = ['barbell', 'dumbbells', 'bodyweight', 'cable_machine', 'kettlebell', 'resistance_bands', 'machine']
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

const difficultyColor: Record<string, string> = {
  beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  intermediate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
}

// Body part → emoji for visual flair without needing images
const bodyPartEmoji: Record<string, string> = {
  back: '🔙',
  cardio: '❤️',
  chest: '💪',
  'lower arms': '🦾',
  'lower legs': '🦵',
  neck: '🦒',
  shoulders: '🏋️',
  'upper arms': '💪',
  'upper legs': '🦵',
  waist: '🎯',
}

// Body part → gradient for card header
const bodyPartGradient: Record<string, string> = {
  back: 'from-blue-900/60 to-slate-900/60',
  cardio: 'from-red-900/60 to-slate-900/60',
  chest: 'from-violet-900/60 to-slate-900/60',
  'lower arms': 'from-orange-900/60 to-slate-900/60',
  'lower legs': 'from-teal-900/60 to-slate-900/60',
  neck: 'from-pink-900/60 to-slate-900/60',
  shoulders: 'from-indigo-900/60 to-slate-900/60',
  'upper arms': 'from-purple-900/60 to-slate-900/60',
  'upper legs': 'from-cyan-900/60 to-slate-900/60',
  waist: 'from-emerald-900/60 to-slate-900/60',
}

interface ExerciseExtended extends Exercise {
  gif_url?: string | null    // start position image
  video_url?: string | null  // contracted position image
  body_part?: string
  target_muscle?: string
  secondary_muscles?: string[]
  description?: string | null
}

/* ─── Exercise Card ─────────────────────────────────────────────────── */
function ExerciseCard({
  exercise,
  onSelect,
}: {
  exercise: ExerciseExtended
  onSelect: (e: ExerciseExtended) => void
}) {
  const bp = exercise.body_part?.toLowerCase() ?? ''
  const gradient = bodyPartGradient[bp] ?? 'from-slate-800/60 to-slate-900/60'
  const emoji = bodyPartEmoji[bp] ?? '🏃'
  const primaryMuscle = exercise.target_muscle ?? exercise.muscle_groups?.[0]
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Show contracted image on hover if available, otherwise start image
  const displayImg = hovered && exercise.video_url && !imgError
    ? exercise.video_url
    : exercise.gif_url

  return (
    <Card
      className="bg-slate-800/50 border-white/10 text-white overflow-hidden flex flex-col group hover:border-violet-500/40 transition-all cursor-pointer"
      onClick={() => onSelect(exercise)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent className="p-0 flex flex-col flex-1">
        {/* Image or fallback */}
        <div className={cn('aspect-square relative overflow-hidden', !displayImg || imgError ? `bg-gradient-to-br ${gradient}` : 'bg-slate-900')}>
          {displayImg && !imgError ? (
            <img
              src={displayImg}
              alt={exercise.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-4xl select-none">{emoji}</span>
              {exercise.body_part && (
                <span className="text-xs text-slate-400 capitalize font-medium">{exercise.body_part}</span>
              )}
            </div>
          )}
          {/* Difficulty badge */}
          <span className={cn(
            'absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full border backdrop-blur-sm',
            difficultyColor[exercise.difficulty]
          )}>
            {exercise.difficulty}
          </span>
        </div>

        {/* Card info */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-semibold text-sm leading-tight capitalize line-clamp-2 mb-2">{exercise.name}</h3>
          <div className="flex flex-wrap gap-1 mt-auto">
            {primaryMuscle && (
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full capitalize">
                {primaryMuscle.replace(/_/g, ' ')}
              </span>
            )}
            {exercise.equipment.slice(0, 1).map((e) => (
              <span key={e} className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full capitalize">
                {e.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Details button */}
        <div className="flex items-center justify-center gap-1 py-2 border-t border-white/10 text-xs text-slate-500 group-hover:text-violet-400 group-hover:bg-violet-500/5 transition-colors">
          View details <ChevronRight className="h-3 w-3" />
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Exercise Detail Modal ─────────────────────────────────────────── */
function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: ExerciseExtended
  onClose: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const bp = exercise.body_part?.toLowerCase() ?? ''
  const gradient = bodyPartGradient[bp] ?? 'from-slate-800/60 to-slate-900/60'
  const emoji = bodyPartEmoji[bp] ?? '🏃'

  // Parse instructions — stored as newline-separated string or a single block
  const steps = exercise.instructions
    ? exercise.instructions.split('\n').filter(Boolean)
    : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header — images or gradient fallback */}
        {(exercise.gif_url || exercise.video_url) ? (
          <div className="flex bg-slate-950 divide-x divide-white/10">
            {exercise.gif_url && (
              <div className="flex-1 aspect-square overflow-hidden">
                <img
                  src={exercise.gif_url}
                  alt={`${exercise.name} start`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            {exercise.video_url && (
              <div className="flex-1 aspect-square overflow-hidden">
                <img
                  src={exercise.video_url}
                  alt={`${exercise.name} contracted`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ) : (
          <div className={cn('flex flex-col items-center justify-center gap-2 py-8 bg-gradient-to-br', gradient)}>
            <span className="text-5xl">{emoji}</span>
            {exercise.body_part && (
              <span className="text-sm text-slate-400 capitalize font-medium">{exercise.body_part}</span>
            )}
          </div>
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Title + badges */}
          <div>
            <h2 className="text-lg font-bold text-white capitalize mb-2">{exercise.name}</h2>
            <div className="flex flex-wrap gap-1.5">
              <span className={cn('text-xs px-2 py-0.5 rounded-full border', difficultyColor[exercise.difficulty])}>
                {exercise.difficulty}
              </span>
              {(exercise.target_muscle ?? exercise.muscle_groups?.[0]) && (
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full capitalize">
                  {(exercise.target_muscle ?? exercise.muscle_groups?.[0])?.replace(/_/g, ' ')}
                </span>
              )}
              {exercise.equipment.map((e) => (
                <span key={e} className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full capitalize">
                  {e.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          {exercise.description && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">About</p>
              <p className="text-sm text-slate-300 leading-relaxed">{exercise.description}</p>
            </div>
          )}

          {/* Instructions */}
          {steps.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">How to perform</p>
              <ol className="space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Secondary muscles */}
          {(exercise.secondary_muscles?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Also works</p>
              <div className="flex flex-wrap gap-1.5">
                {exercise.secondary_muscles!.map((m) => (
                  <span key={m} className="text-xs bg-slate-700/80 text-slate-400 px-2 py-0.5 rounded-full capitalize">
                    {m.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Exercises Page ────────────────────────────────────────────────── */
export default function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseExtended[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [bodyPartFilter, setBodyPartFilter] = useState('')
  const [equipmentFilter, setEquipmentFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(0)
  const [selectedExercise, setSelectedExercise] = useState<ExerciseExtended | null>(null)
  const PAGE_SIZE = 24

  const closeModal = useCallback(() => setSelectedExercise(null), [])

  useEffect(() => {
    setPage(0)
  }, [search, bodyPartFilter, equipmentFilter, difficultyFilter])

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (bodyPartFilter) params.set('body_part', bodyPartFilter)
      if (equipmentFilter) params.set('equipment', equipmentFilter)
      if (difficultyFilter) params.set('difficulty', difficultyFilter)
      params.set('limit', PAGE_SIZE.toString())
      params.set('offset', (page * PAGE_SIZE).toString())

      const res = await fetch(`/api/exercises?${params}`)
      const data = await res.json()
      setExercises(Array.isArray(data) ? data : [])
      setLoading(false)
    }

    const timeout = setTimeout(fetchExercises, 300)
    return () => clearTimeout(timeout)
  }, [search, bodyPartFilter, equipmentFilter, difficultyFilter, page])

  const clearFilters = () => {
    setBodyPartFilter('')
    setEquipmentFilter('')
    setDifficultyFilter('')
  }

  const hasFilters = bodyPartFilter || equipmentFilter || difficultyFilter

  return (
    <div>
      {selectedExercise && (
        <ExerciseModal exercise={selectedExercise} onClose={closeModal} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Exercise Library</h1>
          <p className="text-slate-400 text-sm mt-1">
            {loading ? 'Loading...' : `${exercises.length} exercises${page > 0 ? ` — page ${page + 1}` : ''}`}
          </p>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'border-white/20 text-slate-300 hover:text-white hover:bg-white/5',
              hasFilters && 'border-violet-500 text-violet-400'
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasFilters && (
              <span className="ml-1.5 text-xs bg-violet-500 text-white rounded-full w-4 h-4 inline-flex items-center justify-center">
                {[bodyPartFilter, equipmentFilter, difficultyFilter].filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Body Part</p>
              <div className="flex flex-wrap gap-2">
                {BODY_PARTS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBodyPartFilter(bodyPartFilter === b ? '' : b)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs border transition-all capitalize',
                      bodyPartFilter === b
                        ? 'bg-violet-500 border-violet-500 text-white'
                        : 'border-white/20 text-slate-400 hover:border-white/40 hover:text-white'
                    )}
                  >
                    {bodyPartEmoji[b]} {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Equipment</p>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_LIST.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEquipmentFilter(equipmentFilter === e ? '' : e)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs border transition-all capitalize',
                      equipmentFilter === e
                        ? 'bg-violet-500 border-violet-500 text-white'
                        : 'border-white/20 text-slate-400 hover:border-white/40 hover:text-white'
                    )}
                  >
                    {e.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Difficulty</p>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(difficultyFilter === d ? '' : d)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs border transition-all capitalize',
                      difficultyFilter === d
                        ? 'bg-violet-500 border-violet-500 text-white'
                        : 'border-white/20 text-slate-400 hover:border-white/40 hover:text-white'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-slate-300 underline">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Exercise grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg bg-slate-800" />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No exercises found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} onSelect={setSelectedExercise} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="border-white/20 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30"
            >
              Previous
            </Button>
            <span className="text-sm text-slate-500">Page {page + 1}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={exercises.length < PAGE_SIZE}
              className="border-white/20 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
