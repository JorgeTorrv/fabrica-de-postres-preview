import { useCatalog } from '../hooks/useCatalog'
import { formatCurrency } from '../utils/format'
import { ImageSlot } from './ImageSlot'

function scrollToMenu() {
  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Franja de promociones y destacados, ahora con datos reales del catálogo
 * en vez de una lista decorativa hardcodeada. Las promociones son ofertas
 * con precio propio (se mencionan al hacer el pedido); los destacados son
 * productos normales marcados desde el panel.
 */
export function PromotionsStrip() {
  const { catalog } = useCatalog()
  const featuredProducts = catalog.categories.flatMap((c) => c.items.filter((i) => i.featured && !i.soldOut))

  if (catalog.promotions.length === 0 && featuredProducts.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <h2 className="font-display text-balance text-4xl font-light text-(--color-ink) sm:text-5xl">
          Promociones y
          <br />
          destacados
        </h2>
        <p className="max-w-sm text-(--color-ink-soft)">Sabores que han conquistado Tampico, y ofertas del momento.</p>
      </div>

      {catalog.promotions.length > 0 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.promotions.map((promo) => (
            <div key={promo.id} className="flex items-center gap-4 rounded-2xl border border-(--color-line) bg-(--color-paper) p-4">
              <ImageSlot src={promo.image ?? ''} alt={promo.title} placeholderLabel={promo.title} className="h-16 w-16 flex-none rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg leading-tight text-(--color-ink)">{promo.title}</p>
                {promo.description && <p className="mt-0.5 truncate text-xs text-(--color-ink-soft)">{promo.description}</p>}
              </div>
              {promo.price != null && <span className="flex-none font-medium text-(--color-ink)">{formatCurrency(promo.price)}</span>}
            </div>
          ))}
        </div>
      )}

      {featuredProducts.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {featuredProducts.slice(0, 3).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={scrollToMenu}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl text-left"
            >
              <ImageSlot
                src={item.image ?? ''}
                alt={item.name}
                placeholderLabel={item.name}
                className="h-full w-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--color-ink)/80 via-(--color-ink)/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl text-(--color-cream)">{item.name}</h3>
                {item.description && <p className="mt-2 max-w-xs text-sm text-(--color-cream)/85">{item.description}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={scrollToMenu}
          className="rounded-full border border-(--color-ink)/15 px-8 py-3.5 text-sm font-medium text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
        >
          Ver menú completo
        </button>
      </div>
    </section>
  )
}
