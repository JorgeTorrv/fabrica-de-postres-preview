import { API_URL } from './config'
import type { RatingSummary } from '../data/types'

/** Manda la calificación al panel admin. Devuelve el promedio/conteo ya actualizado, o null si falló. */
export async function submitRating(
  itemType: 'product' | 'promotion',
  itemId: string,
  stars: number,
): Promise<RatingSummary | null> {
  try {
    const res = await fetch(`${API_URL}/api/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemType, itemId, stars }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { rating: RatingSummary }
    return data.rating
  } catch {
    return null
  }
}
