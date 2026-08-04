import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCatalog } from '../hooks/useCatalog'
import type { MenuItem, Promotion } from '../data/types'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'
import { ProductModal } from './ProductModal'

const PROMOTIONS_ID = '__promociones__'

function scrollToSection(id: string) {
  document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Fila de producto: lista plana, sin tarjeta ni miniatura — igual que el
 * menú de referencia del negocio. Si el producto tiene una sola opción de
 * precio, se muestra a la derecha del nombre; si tiene varias (tamaños,
 * presentaciones, o sabores con precio distinto), cada una se lista debajo
 * con su propio precio, sin necesidad de abrir el detalle para verlos.
 */
function MenuRow({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  const subtitleParts: string[] = []
  if (item.flavors && item.flavors.length > 0) subtitleParts.push(item.flavors.join(', '))
  if (item.note) subtitleParts.push(item.note)

  return (
    <button
      type="button"
      disabled={item.soldOut}
      onClick={onOpen}
      className="flex w-full flex-col gap-1 border-b border-(--color-line) py-4 text-left transition-colors last:border-b-0 hover:bg-(--color-cream-dim)/50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-lg text-(--color-ink)">{item.name}</span>
        {item.customQuote ? (
          <span className="flex-none text-sm text-(--color-ink-soft)">Cotización</span>
        ) : item.options.length === 1 ? (
          <span className="flex-none font-medium text-(--color-ink)">{formatCurrency(item.options[0].price)}</span>
        ) : null}
      </div>

      {subtitleParts.length > 0 && <p className="text-sm text-(--color-ink-soft)">{subtitleParts.join(' · ')}</p>}

      {item.description && <p className="text-sm text-(--color-ink-soft)">{item.description}</p>}

      {item.options.length > 1 && (
        <ul className="mt-1 flex flex-col gap-0.5">
          {item.options.map((option) => (
            <li key={option.label} className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-(--color-ink-soft)">{option.label}</span>
              <span className="flex-none font-medium text-(--color-ink)">{formatCurrency(option.price)}</span>
            </li>
          ))}
        </ul>
      )}

      {item.soldOut && <p className="text-xs font-medium text-(--color-wine)">Agotado</p>}
      {!item.soldOut && item.recommended && <p className="text-xs text-(--color-wine)">Recomendación de la casa</p>}
    </button>
  )
}

function PromotionRow({ promo }: { promo: Promotion }) {
  return (
    <div className="flex flex-col gap-1 border-b border-(--color-line) py-4 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-lg text-(--color-ink)">{promo.title}</span>
        {promo.price != null && <span className="flex-none font-medium text-(--color-ink)">{formatCurrency(promo.price)}</span>}
      </div>
      {promo.description && <p className="text-sm text-(--color-ink-soft)">{promo.description}</p>}
    </div>
  )
}

/**
 * El menú completo: una lista plana y continua, sin tarjetas ni fotos por
 * fila (las fotos, cuando existan, viven en el detalle del producto). Las
 * promociones son la primera sección, igual que en el menú real del
 * negocio. Nav superior para saltar entre categorías en una lista larga.
 */
export function Catalog() {
  const { catalog } = useCatalog()
  const { itemCount, openCart } = useCart()
  const [activeItem, setActiveItem] = useState<{ item: MenuItem; categoryName: string } | null>(null)

  const jumpTargets = [
    ...(catalog.promotions.length > 0 ? [{ id: PROMOTIONS_ID, name: 'Promociones' }] : []),
    ...catalog.categories.map((c) => ({ id: c.id, name: c.name })),
  ]

  return (
    <section id="menu" className="bg-(--color-cream)">
      <div className="sticky top-[64px] z-30 border-b border-(--color-line) bg-(--color-cream)/95 backdrop-blur lg:top-[76px]">
        <div className="mx-auto flex items-center justify-between gap-4 px-6 py-3 lg:px-10">
          <nav className="flex min-w-0 flex-1 gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {jumpTargets.map((target) => (
              <button
                key={target.id}
                type="button"
                onClick={() => scrollToSection(target.id)}
                className="flex-none text-sm text-(--color-ink-soft) transition-colors hover:text-(--color-wine)"
              >
                {target.name}
              </button>
            ))}
          </nav>

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

      <div className="mx-auto max-w-2xl px-6 py-10 lg:px-0">
        {catalog.promotions.length > 0 && (
          <div id={`cat-${PROMOTIONS_ID}`} className="mb-10 scroll-mt-32">
            <h2 className="font-display text-2xl uppercase tracking-wide text-(--color-wine)">Promociones</h2>
            <div className="mt-2">
              {catalog.promotions.map((promo) => (
                <PromotionRow key={promo.id} promo={promo} />
              ))}
            </div>
          </div>
        )}

        {catalog.categories.map((category) => (
          <div key={category.id} id={`cat-${category.id}`} className="mb-10 scroll-mt-32">
            <h2 className="font-display text-2xl uppercase tracking-wide text-(--color-wine)">{category.name}</h2>
            {category.description && <p className="mt-1 text-sm text-(--color-ink-soft)">{category.description}</p>}
            <div className="mt-2">
              {category.items.map((item) => (
                <MenuRow key={item.id} item={item} onOpen={() => setActiveItem({ item, categoryName: category.name })} />
              ))}
            </div>
          </div>
        ))}

        {catalog.categories.length === 0 && (
          <p className="text-center text-(--color-ink-soft)">El menú no está disponible por ahora.</p>
        )}
      </div>

      {activeItem && !activeItem.item.soldOut && (
        <ProductModal item={activeItem.item} categoryName={activeItem.categoryName} onClose={() => setActiveItem(null)} />
      )}
    </section>
  )
}
