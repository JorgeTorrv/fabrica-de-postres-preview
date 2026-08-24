import { StarRow } from './StarIcons'
import { roundToDisplayStars } from '../utils/starDisplay'

type StarRatingProps = {
  avg: number
  count: number
  size?: 'sm' | 'md'
}

/**
 * Estrellas de solo lectura. Sin calificaciones todavía se muestran las 5
 * vacías con "(0)" — así el espacio de estrellas siempre está ahí, no
 * aparece de la nada cuando llega la primera calificación. El promedio se
 * redondea a la estrella visible más cercana en pasos de 0.5 (ver
 * `roundToDisplayStars`) antes de mostrarse, no se muestra el porcentaje
 * exacto.
 */
export function StarRating({ avg, count, size = 'sm' }: StarRatingProps) {
  const displayValue = count === 0 ? 0 : roundToDisplayStars(avg)
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'

  return (
    <div className="flex items-center gap-1.5">
      <StarRow value={displayValue} sizeClass={sizeClass} />
      <span className="text-xs text-(--color-ink-soft)">({count})</span>
    </div>
  )
}
