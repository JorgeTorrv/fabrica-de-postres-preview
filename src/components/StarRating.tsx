import { Star } from 'lucide-react'

type StarRatingProps = {
  avg: number
  count: number
  size?: 'sm' | 'md'
}

/**
 * Estrellas de solo lectura con relleno parcial (dos filas superpuestas: una
 * gris de fondo, una dorada recortada al % del promedio) — así un 4.3 se ve
 * como tal, no redondeado a 4 o 5 estrellas completas.
 */
export function StarRating({ avg, count, size = 'sm' }: StarRatingProps) {
  if (count === 0) return null

  const pct = Math.max(0, Math.min(100, (avg / 5) * 100))
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex">
        <div className="flex text-(--color-line)">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={starSize} strokeWidth={1.5} fill="currentColor" />
          ))}
        </div>
        <div className="absolute inset-0 flex overflow-hidden text-(--color-gold)" style={{ width: `${pct}%` }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={starSize} strokeWidth={1.5} fill="currentColor" />
          ))}
        </div>
      </div>
      <span className="text-xs text-(--color-ink-soft)">({count})</span>
    </div>
  )
}
