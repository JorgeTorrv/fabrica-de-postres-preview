/**
 * Redondea el promedio a la estrella visible más cercana, en pasos de 0.5,
 * con el corte de "sube a la estrella completa" en .6 en vez del estándar
 * .75 — así una calificación de 4.6 ya se ve como 5 estrellas llenas.
 */
export function roundToDisplayStars(avg: number): number {
  const whole = Math.floor(avg)
  const frac = avg - whole
  if (frac < 0.3) return whole
  if (frac < 0.6) return whole + 0.5
  return whole + 1
}
