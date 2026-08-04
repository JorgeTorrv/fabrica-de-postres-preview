export type PricedOption = {
  label: string
  price: number
}

export type ExtraOption = {
  label: string
  price: number
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
  recommended?: boolean
  /** Se muestra en la franja de destacados de la portada. */
  featured?: boolean
  /** True for made-to-order items with no fixed price (quote on request). */
  customQuote?: boolean
  /** Oculta el botón de agregar y muestra "Agotado". */
  soldOut?: boolean
  /** URL absoluta servida por la API del panel admin, o undefined si aún no hay foto. */
  image?: string
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
  image?: string
}

export type Catalog = {
  categories: MenuCategory[]
  promotions: Promotion[]
}
