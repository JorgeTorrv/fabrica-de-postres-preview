// Se corre antes de `vite build` (ver package.json y los workflows de deploy).
// Descarga el catálogo real de la API y lo guarda como respaldo empacado en
// el bundle. Si la API falla justo en ese momento, el build usa el último
// respaldo ya comiteado en vez de romperse — es el último recurso de
// useCatalog cuando ni el caché local ni el fetch en vivo del visitante
// funcionan (primera visita + API caída).
import { writeFile } from 'node:fs/promises'

const API_URL = process.env.VITE_API_URL || 'https://fabrica-postres-admin.pages.dev'
const OUT_PATH = new URL('../src/data/catalog-fallback.json', import.meta.url)

try {
  const res = await fetch(`${API_URL}/api/catalog`)
  if (!res.ok) throw new Error(`API respondió ${res.status}`)
  const catalog = await res.json()
  await writeFile(OUT_PATH, JSON.stringify(catalog, null, 2) + '\n')
  console.log(`✓ Catálogo de respaldo actualizado (${catalog.categories?.length ?? 0} categorías).`)
} catch (err) {
  console.warn(`⚠ No se pudo actualizar el catálogo de respaldo (${err.message}). Se usa el existente.`)
  // No falla el build: el archivo ya comiteado sigue siendo válido.
}
