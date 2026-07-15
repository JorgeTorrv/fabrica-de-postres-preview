import { useState } from 'react'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { MENU } from '../data/menu'
import type { MenuItem } from '../data/types'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'
import { ImageSlot } from './ImageSlot'
import { ProductModal } from './ProductModal'

type MenuOverlayProps = {
  onClose: () => void
}

function priceLabel(item: MenuItem): string {
  if (item.customQuote) return 'Cotización'
  const prices = item.options.map((o) => o.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return formatCurrency(min)
  return `Desde ${formatCurrency(min)}`
}

export function MenuOverlay({ onClose }: MenuOverlayProps) {
  const { itemCount, openCart } = useCart()
  const [activeItem, setActiveItem] = useState<{ item: MenuItem; categoryName: string } | null>(null)

  const scrollToCategory = (id: string) => {
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-(--color-cream)">
      <div className="flex items-center justify-between border-b border-(--color-line) px-6 py-4 lg:px-10">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-(--color-ink) transition-colors hover:text-(--color-wine)"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Volver al sitio
        </button>

        <h2 className="hidden font-display text-xl text-(--color-ink) sm:block">Nuestro menú</h2>

        <button
          type="button"
          onClick={openCart}
          className="relative flex items-center gap-2 rounded-full bg-(--color-wine) px-5 py-2.5 text-sm font-medium text-(--color-cream) transition-colors hover:bg-(--color-wine-deep)"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          Carrito
          {itemCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--color-cream) text-xs font-semibold text-(--color-wine)">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-(--color-line) px-6 py-3 [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden">
        {MENU.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => scrollToCategory(category.id)}
            className="flex-none rounded-full border border-(--color-line) px-4 py-2 text-sm text-(--color-ink-soft) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
          {MENU.map((category) => (
            <div key={category.id} id={`cat-${category.id}`} className="mb-16 scroll-mt-6 last:mb-4">
              <h3 className="font-display text-3xl text-(--color-ink)">{category.name}</h3>
              {category.description && (
                <p className="mt-1.5 text-sm text-(--color-ink-soft)">{category.description}</p>
              )}

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {category.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveItem({ item, categoryName: category.name })}
                    className="flex items-center gap-4 rounded-2xl border border-(--color-line) bg-(--color-paper) p-3 text-left transition-shadow hover:shadow-(--shadow-soft)"
                  >
                    <ImageSlot
                      src={`/images/menu/${item.image}`}
                      alt={item.name}
                      placeholderLabel={item.image}
                      className="h-20 w-20 flex-none rounded-xl"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg leading-tight text-(--color-ink)">{item.name}</p>
                      {item.recommended && <p className="mt-0.5 text-xs text-(--color-wine)">Recomendado</p>}
                      {item.flavors && (
                        <p className="mt-0.5 truncate text-xs text-(--color-ink-soft)">
                          {item.flavors.length} sabores disponibles
                        </p>
                      )}
                    </div>
                    <span className="flex-none font-medium text-(--color-ink)">{priceLabel(item)}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeItem && (
        <ProductModal
          item={activeItem.item}
          categoryName={activeItem.categoryName}
          onClose={() => setActiveItem(null)}
        />
      )}
    </div>
  )
}
