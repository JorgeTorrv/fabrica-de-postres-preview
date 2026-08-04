import { useEffect, useState } from 'react'
import { API_URL } from '../lib/config'
import fallbackCatalog from '../data/catalog-fallback.json'
import type { Catalog } from '../data/types'

const STORAGE_KEY = 'fabrica-de-postres-catalog-cache'
const FETCH_TIMEOUT_MS = 3000

function readCache(): Catalog | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Catalog) : null
  } catch {
    return null
  }
}

function writeCache(catalog: Catalog) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
  } catch {
    // localStorage lleno o deshabilitado: no es crítico, se sigue funcionando sin caché.
  }
}

async function fetchCatalog(): Promise<Catalog> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(`${API_URL}/api/catalog`, { signal: controller.signal })
    if (!res.ok) throw new Error(`API respondió ${res.status}`)
    return (await res.json()) as Catalog
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Catálogo en vivo con tres capas de respaldo, para que el sitio nunca se
 * quede en blanco ni se sienta lento:
 *
 * 1. Caché en localStorage — si existe, se pinta al instante mientras se
 *    revalida en segundo plano (stale-while-revalidate).
 * 2. Fetch a la API en vivo (timeout corto) — actualiza estado + caché.
 * 3. `catalog-fallback.json` empacado en el build — último recurso si es
 *    la primera visita (sin caché) y la API no responde a tiempo.
 */
export function useCatalog(): { catalog: Catalog; loading: boolean; stale: boolean } {
  const cached = readCache()
  const [catalog, setCatalog] = useState<Catalog>(cached ?? (fallbackCatalog as Catalog))
  const [loading, setLoading] = useState(!cached)
  const [stale, setStale] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchCatalog()
      .then((fresh) => {
        if (cancelled) return
        setCatalog(fresh)
        setStale(false)
        writeCache(fresh)
      })
      .catch(() => {
        // Se queda con localStorage o el fallback de build — ya están en pantalla.
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { catalog, loading, stale }
}
