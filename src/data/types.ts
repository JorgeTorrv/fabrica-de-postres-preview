export type PricedOption = {
  label: string
  price: number
}

export type ExtraOption = {
  label: string
  price: number
}

export type RatingSummary = {
  avg: number
  count: number
}

export type MenuItem = {
  id: string
  name: string
  /** Descripción corta para el grid y el modal (distinta de `note`). */
  description?: string
  /** Informational flavor/topping list shown as a single-select chip group. Does not change price. */
  flavors?: string[]
  flavorsLabel?: string
  /** Price-bearing single-select choices (size, presentation, or flavor-with-price). */
  options: PricedOption[]
  optionsLabel?: string
  /** Optional multi-select add-ons with additive price. */
  extras?: ExtraOption[]
  note?: string
  /** Se muestra en la franja de destacados de la portada. */
  featured?: boolean
  /** True for made-to-order items with no fixed price (quote on request). */
  customQuote?: boolean
  /** Oculta el botón de agregar y muestra "Agotado". */
  soldOut?: boolean
  /** Días en los que aplica (códigos "mon".."sun"). Sin restricción si vacío/undefined. */
  availableDays?: string[]
  /** URL absoluta servida por la API del panel admin, o undefined si aún no hay foto. */
  image?: string
  /** Undefined si nadie lo ha calificado todavía. */
  rating?: RatingSummary
}

export type MenuCategory = {
  id: string
  name: string
  description?: string
  items: MenuItem[]
}

export type Promotion = {
  id: string
  title: string
  description?: string
  price?: number
  badgeLabel?: string
  /** Días en los que aplica (códigos "mon".."sun"). Sin restricción si vacío/undefined. */
  availableDays?: string[]
  /** true si hoy no es uno de los días disponibles. */
  soldOut?: boolean
  image?: string
  /** Undefined si nadie la ha calificado todavía. */
  rating?: RatingSummary
}

export type Catalog = {
  categories: MenuCategory[]
  promotions: Promotion[]
  /** Controlado desde el panel (Ajustes). Opcional por compatibilidad con caché/fallback viejos. */
  catalogView?: 'list' | 'gallery'
  /** Temporal — comparar en vivo las dos variantes de rosa salmón, ver Ajustes. */
  accentColor?: 'bright' | 'terracotta' | 'coral' | 'custom'
  /** Hex del acento personalizado (si accentColor === 'custom'). */
  accentColorCustom?: string
  /** Temporal — comparar en vivo las variantes de verde, ver Ajustes. */
  sageColor?: 'current' | 'new' | 'custom'
  /** Hex del verde personalizado (si sageColor === 'custom'). */
  sageColorCustom?: string
}
