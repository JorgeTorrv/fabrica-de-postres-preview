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
  /** True for made-to-order items with no fixed price (quote on request). */
  customQuote?: boolean
  /** Image filename inside /public/images/menu/, e.g. "pastel-clasico.jpg" */
  image?: string
}

export type MenuCategory = {
  id: string
  name: string
  description?: string
  items: MenuItem[]
}
