export type DayCode = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

/** Orden canónico de semana (lunes primero). */
export const DAY_CODES: DayCode[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const DAY_LABELS: Record<DayCode, string> = {
  mon: 'Lun',
  tue: 'Mar',
  wed: 'Mié',
  thu: 'Jue',
  fri: 'Vie',
  sat: 'Sáb',
  sun: 'Dom',
}

/** Chips de día solo tienen sentido para un subconjunto parcial: vacío o los
 * 7 días significan "sin restricción", así que no se muestra nada. */
export function partialDays(days: string[] | undefined): DayCode[] {
  if (!days || days.length === 0 || days.length >= 7) return []
  return DAY_CODES.filter((code) => days.includes(code))
}
