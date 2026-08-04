import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCatalog } from '../hooks/useCatalog'
import type { MenuItem } from '../data/types'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'
import { ImageSlot } from './ImageSlot'
import { ProductModal } from './ProductModal'

function priceLabel(item: MenuItem): string {
  if (item.customQuote) return 'Cotización'
  if (item.options.length === 0) return ''
  const prices = item.options.map((o) => o.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return formatCurrency(min)
  return `Desde ${formatCurrency(min)}`
}

/**
 * El catálogo completo, ahora como sección principal de la portada (ya no un
 * overlay escondido detrás de un botón). Filtro real por categoría además
 * del scroll a ancla, para no recargar ni perder contexto en móvil.
 */
export function Catalog() {
  const { catalog } = useCatalog()
  const { itemCount, openCart } = useCart()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState<{ item: MenuItem; categoryName: string } | null>(null)

  const scrollToCategory = (id: string) => {
    setActiveCategory(id)
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const visibleCategories = activeCategory ? catalog.categories.filter((c) => c.id === activeCategory) : catalog.categories

  return (
    <section id="menu" className="bg-(--color-cream)">
      <div className="sticky top-[64px] z-30 border-b border-(--color-line) bg-(--color-cream)/95 backdrop-blur lg:top-[76px]">
        <div className="mx-auto flex items-center justify-between gap-4 px-6 py-3 lg:px-10">
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`flex-none rounded-full border px-4 py-2 text-sm transition-colors ${
                activeCategory === null
                  ? 'border-(--color-wine) bg-(--color-wine) text-(--color-cream)'
                  : 'border-(--color-line) text-(--color-ink-soft) hover:border-(--color-wine)'
              }`}
            >
              Todo
            </button>
            {catalog.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => scrollToCategory(category.id)}
                className={`flex-none rounded-full border px-4 py-2 text-sm transition-colors ${
                  activeCategory === category.id
                    ? 'border-(--color-wine) bg-(--color-wine) text-(--color-cream)'
                    : 'border-(--color-line) text-(--color-ink-soft) hover:border-(--color-wine)'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={openCart}
            className="relative flex flex-none items-center gap-2 rounded-full bg-(--color-wine) px-5 py-2.5 text-sm font-medium text-(--color-cream) transition-colors hover:bg-(--color-wine-deep)"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Carrito</span>
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--color-cream) text-xs font-semibold text-(--color-wine)">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
        {visibleCategories.map((category) => (
          <div key={category.id} id={`cat-${category.id}`} className="mb-16 scroll-mt-32 last:mb-4">
            <h2 className="font-display text-3xl text-(--color-ink)">{category.name}</h2>
            {category.description && <p className="mt-1.5 text-sm text-(--color-ink-soft)">{category.description}</p>}

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.soldOut}
                  onClick={() => setActiveItem({ item, categoryName: category.name })}
                  className="flex items-center gap-4 rounded-2xl border border-(--color-line) bg-(--color-paper) p-3 text-left transition-shadow hover:shadow-(--shadow-soft) disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ImageSlot
                    src={item.image ?? ''}
                    alt={item.name}
                    placeholderLabel={item.name}
                    className="h-20 w-20 flex-none rounded-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight text-(--color-ink)">{item.name}</p>
                    {item.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-(--color-ink-soft)">{item.description}</p>
                    )}
                    {item.soldOut ? (
                      <p className="mt-0.5 text-xs font-medium text-(--color-wine)">Agotado</p>
                    ) : item.recommended ? (
                      <p className="mt-0.5 text-xs text-(--color-wine)">Recomendado</p>
                    ) : item.flavors && item.flavors.length > 0 ? (
                      <p className="mt-0.5 truncate text-xs text-(--color-ink-soft)">
                        {item.flavors.length} sabores disponibles
                      </p>
                    ) : null}
                  </div>
                  <span className="flex-none font-medium text-(--color-ink)">{priceLabel(item)}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {visibleCategories.length === 0 && (
          <p className="text-center text-(--color-ink-soft)">No hay productos disponibles en esta categoría por ahora.</p>
        )}
      </div>

      {activeItem && !activeItem.item.soldOut && (
        <ProductModal
          item={activeItem.item}
          categoryName={activeItem.categoryName}
          onClose={() => setActiveItem(null)}
        />
      )}
    </section>
  )
}
