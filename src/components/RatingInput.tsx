import { useRef, useState } from 'react'
import { Star } from 'lucide-react'
import { submitRating } from '../lib/ratings'
import { getRatedStars, markRated } from '../utils/ratedItems'
import type { RatingSummary } from '../data/types'

type RatingInputProps = {
  itemType: 'product' | 'promotion'
  itemId: string
  onRated?: (summary: RatingSummary) => void
}

const STAR_COUNT = 5

/** Redondea una posición continua (0-5) a la media estrella más cercana, mínimo 0.5. */
function snapToHalf(value: number): number {
  const snapped = Math.round(value * 2) / 2
  return Math.max(0.5, Math.min(STAR_COUNT, snapped))
}

/**
 * Calificación con toque/clic, con medias estrellas — pensada para móvil:
 * toda la fila de estrellas es un solo control continuo (no 5 botones
 * angostos donde acertarle a "la mitad" con el dedo sería difícil). Tocar
 * cualquier punto de la fila califica directo con la media estrella más
 * cercana a ese punto, sin necesidad de hover previo.
 *
 * Sin login: el backend limita a una calificación por red por ítem (ver
 * rater-key en el panel admin); aquí además se recuerda en este navegador
 * para no reinvitar a calificar lo mismo.
 */
export function RatingInput({ itemType, itemId, onRated }: RatingInputProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [myStars, setMyStars] = useState<number | null>(() => getRatedStars(itemType, itemId))
  const [hoverStars, setHoverStars] = useState<number | null>(null)
  const [justRated, setJustRated] = useState(false)

  const displayStars = hoverStars ?? myStars ?? 0
  const pct = Math.max(0, Math.min(100, (displayStars / STAR_COUNT) * 100))

  const valueFromPointer = (clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return 0.5
    const ratio = (clientX - rect.left) / rect.width
    return snapToHalf(ratio * STAR_COUNT)
  }

  const handleRate = (stars: number) => {
    setMyStars(stars)
    markRated(itemType, itemId, stars)
    setJustRated(true)
    submitRating(itemType, itemId, stars).then((summary) => {
      if (summary) onRated?.(summary)
    })
  }

  return (
    <div>
      <p className="text-sm font-medium text-(--color-ink)">{myStars ? 'Tu calificación' : 'Califica este producto'}</p>
      <div className="mt-2 flex items-center gap-3">
        <div
          ref={trackRef}
          role="slider"
          aria-label="Calificación en estrellas"
          aria-valuemin={0.5}
          aria-valuemax={STAR_COUNT}
          aria-valuenow={myStars ?? undefined}
          className="relative flex select-none py-2"
          onClick={(e) => handleRate(valueFromPointer(e.clientX))}
          onMouseMove={(e) => setHoverStars(valueFromPointer(e.clientX))}
          onMouseLeave={() => setHoverStars(null)}
        >
          <div className="flex text-(--color-line)">
            {Array.from({ length: STAR_COUNT }).map((_, i) => (
              <Star key={i} className="h-9 w-9" strokeWidth={1.5} fill="currentColor" />
            ))}
          </div>
          <div
            className="absolute inset-y-2 left-0 flex overflow-hidden text-(--color-gold)"
            style={{ width: `${pct}%` }}
          >
            {Array.from({ length: STAR_COUNT }).map((_, i) => (
              <Star key={i} className="h-9 w-9" strokeWidth={1.5} fill="currentColor" />
            ))}
          </div>
        </div>
        {justRated && <span className="text-xs text-(--color-ink-soft)">¡Gracias por tu calificación!</span>}
      </div>
    </div>
  )
}
