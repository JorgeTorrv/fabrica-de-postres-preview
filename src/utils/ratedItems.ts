const STORAGE_KEY = 'fabrica-de-postres-rated-items'

type RatedMap = Record<string, number>

function readMap(): RatedMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as RatedMap) : {}
  } catch {
    return {}
  }
}

function writeMap(map: RatedMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // localStorage lleno o deshabilitado: no es crítico.
  }
}

function keyFor(itemType: 'product' | 'promotion', itemId: string) {
  return `${itemType}:${itemId}`
}

/** Estrellas que este navegador ya mandó para este ítem, o null si nunca calificó. */
export function getRatedStars(itemType: 'product' | 'promotion', itemId: string): number | null {
  return readMap()[keyFor(itemType, itemId)] ?? null
}

export function markRated(itemType: 'product' | 'promotion', itemId: string, stars: number) {
  const map = readMap()
  map[keyFor(itemType, itemId)] = stars
  writeMap(map)
}
