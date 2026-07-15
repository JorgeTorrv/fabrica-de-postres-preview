import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem } from '../data/cart-types'

const STORAGE_KEY = 'fabrica-de-postres-cart'

type NewCartItem = Omit<CartItem, 'cartId'>

type CartContextValue = {
  items: CartItem[]
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: NewCartItem) => void
  removeItem: (cartId: string) => void
  updateQuantity: (cartId: string, quantity: number) => void
  updateComment: (cartId: string, comment: string) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  hasQuoteItems: boolean
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart())
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item: NewCartItem) => {
    const cartId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setItems((prev) => [...prev, { ...item, cartId }])
    setIsCartOpen(true)
  }

  const removeItem = (cartId: string) => {
    setItems((prev) => prev.filter((item) => item.cartId !== cartId))
  }

  const updateQuantity = (cartId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity: Math.max(1, quantity) } : item)),
    )
  }

  const updateComment = (cartId: string, comment: string) => {
    setItems((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, comment } : item)))
  }

  const clearCart = () => setItems([])

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (item.customQuote) return sum
        const extrasTotal = item.extras.reduce((extraSum, extra) => extraSum + extra.price, 0)
        return sum + (item.optionPrice + extrasTotal) * item.quantity
      }, 0),
    [items],
  )

  const hasQuoteItems = useMemo(() => items.some((item) => item.customQuote), [items])

  const value: CartContextValue = {
    items,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addItem,
    removeItem,
    updateQuantity,
    updateComment,
    clearCart,
    itemCount,
    subtotal,
    hasQuoteItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
