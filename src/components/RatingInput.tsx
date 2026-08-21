import { useState } from 'react'
import { Star } from 'lucide-react'
import { submitRating } from '../lib/ratings'
import { getRatedStars, markRated } from '../utils/ratedItems'
import type { RatingSummary } from '../data/types'

type RatingInputProps = {
  itemType: 'product' | 'promotion'
  itemId: string
  onRated?: (summary: RatingSummary) => void
}

/**
 * Calificación con clic, sin login ni escaneo de ticket — cualquiera puede
 * calificar mientras se define un sistema que verifique compra real. El
 * backend limita a una calificación por red por ítem (re-calificar
 * actualiza); aquí además se recuerda en este navegador para no invitar a
 * calificar de nuevo cada vez que se abre el producto.
 */
export function RatingInput({ itemType, itemId, onRated }: RatingInputProps) {
  const [myStars, setMyStars] = useState<number | null>(() => getRatedStars(itemType, itemId))
  const [hoverStars, setHoverStars] = useState<number | null>(null)
  const [justRated, setJustRated] = useState(false)

  const displayStars = hoverStars ?? myStars ?? 0

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
        <div className="flex gap-1" onMouseLeave={() => setHoverStars(null)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleRate(n)}
              onMouseEnter={() => setHoverStars(n)}
              aria-label={`Calificar con ${n} estrella${n > 1 ? 's' : ''}`}
              className="p-0.5"
            >
              <Star
                className="h-6 w-6 transition-colors"
                strokeWidth={1.5}
                fill={n <= displayStars ? 'var(--color-gold)' : 'none'}
                stroke={n <= displayStars ? 'var(--color-gold)' : 'var(--color-line)'}
              />
            </button>
          ))}
        </div>
        {justRated && <span className="text-xs text-(--color-ink-soft)">¡Gracias por tu calificación!</span>}
      </div>
    </div>
  )
}
