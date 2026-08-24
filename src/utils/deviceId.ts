const STORAGE_KEY = 'fabrica-de-postres-device-id'

/**
 * Id aleatorio único por navegador (no una IP), usado por el backend para
 * limitar a una calificación por dispositivo por ítem. Se genera una sola
 * vez y se reutiliza desde localStorage.
 */
export function getDeviceId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) return existing
    const id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
    return id
  } catch {
    // localStorage deshabilitado: id de un solo uso, no se puede recordar entre calificaciones.
    return crypto.randomUUID()
  }
}
