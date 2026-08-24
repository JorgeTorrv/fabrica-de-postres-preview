import { StarRow } from './StarIcons'
import { roundToDisplayStars } from '../utils/starDisplay'

type StarRatingProps = {
  avg: number
  count: number
  size?: 'sm' | 'md'
}

/**
 * Estrellas de solo lectura. El promedio se redondea a la estrella visible
 * más cercana en pasos de 0.5 (ver `roundToDisplayStars`) antes de
 * mostrarse, no se muestra el porcentaje exacto.
 */
export function StarRating({ avg, count, size = 'sm' }: StarRatingProps) {
  if (count === 0) return null

  const displayValue = roundToDisplayStars(avg)
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'

  return (
    <div className="flex items-center gap-1.5">
      <StarRow value={displayValue} sizeClass={sizeClass} />
      <span className="text-xs text-(--color-ink-soft)">({count})</span>
    </div>
  )
}
