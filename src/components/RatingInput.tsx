import { useEffect, useRef, useState } from 'react'
import { StarRow } from './StarIcons'
import { submitRating } from '../lib/ratings'
import { preloadTurnstile } from '../lib/turnstile'
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
 * Sin login y sin límite por persona — cualquiera puede votar las veces que
 * quiera (la única protección contra abuso es Turnstile, invisible, al
 * mandar el voto). Aquí se recuerda en este navegador para no reinvitar a
 * calificar lo mismo, aunque volver a tocar sí permite cambiar el voto.
 */
export function RatingInput({ itemType, itemId, onRated }: RatingInputProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [myStars, setMyStars] = useState<number | null>(() => getRatedStars(itemType, itemId))
  const [hoverStars, setHoverStars] = useState<number | null>(null)
  const [justRated, setJustRated] = useState(false)

  // Deja el script de Turnstile listo desde que se abre el producto, para
  // que el primer tap no cargue con esa latencia — ver turnstile.ts.
  useEffect(() => {
    preloadTurnstile()
  }, [])

  const displayStars = hoverStars ?? myStars ?? 0

  const valueFromPointer = (clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return 0.5
    const ratio = (clientX - rect.left) / rect.width
    return snapToHalf(ratio * STAR_COUNT)
  }

  const handleRate = (stars: number) => {
    // Optimista: estrellas y "¡Gracias!" salen al toque, sin esperar el
    // viaje al server (~1-2s por el reto de Turnstile). Solo se revierte
    // si el server termina rechazando el voto.
    setMyStars(stars)
    setJustRated(true)
    submitRating(itemType, itemId, stars).then((summary) => {
      if (!summary) {
        // El server no confirmó (Turnstile/red/etc.) — no lo guardamos como
        // calificado localmente, para no "atorar" al usuario en un voto que
        // nunca se contó (era el bug: se veía calificado pero no sumaba).
        setMyStars(getRatedStars(itemType, itemId))
        setJustRated(false)
        return
      }
      markRated(itemType, itemId, stars)
      onRated?.(summary)
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
          <StarRow value={displayStars} sizeClass="h-9 w-9" />
        </div>
        {justRated && <span className="text-xs text-(--color-ink-soft)">¡Gracias por tu calificación!</span>}
      </div>
    </div>
  )
}
