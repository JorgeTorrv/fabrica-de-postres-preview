export type CartExtra = {
  label: string
  price: number
}

export type CartItem = {
  cartId: string
  categoryName: string
  name: string
  flavor?: string
  optionLabel: string
  optionPrice: number
  extras: CartExtra[]
  quantity: number
  comment?: string
  customQuote?: boolean
  image?: string
}
