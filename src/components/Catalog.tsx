import { useState } from 'react'
import { Clock } from 'lucide-react'
import { useCatalog } from '../hooks/useCatalog'
import type { MenuItem, Promotion } from '../data/types'
import { formatCurrency } from '../utils/format'
import { asset } from '../utils/asset'
import { DAY_LABELS, partialDays } from '../data/days'
import { ProductModal } from './ProductModal'
import { PromotionModal } from './PromotionModal'
import { ImageSlot } from './ImageSlot'
import { StarRating } from './StarRating'

const PROMOTIONS_ID = '__promociones__'

/** Imagen de muestra para la vista de galería mientras no haya foto real cargada. */
const DEMO_GALLERY_IMAGE = 'https://fabrica-postres-admin.pages.dev/api/images/menu/pastel-zanahoria-28004c1e.jpg'

function scrollToSection(id: string) {
  document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Chip informativo de días — solo tiene sentido para un subconjunto parcial
 * de la semana; sin días marcados o con los 7 marcados no se muestra nada
 * (ambos casos significan "disponible siempre").
 */
function DaysBadge({ days }: { days?: string[] }) {
  const shown = partialDays(days)
  if (shown.length === 0) return null

  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {shown.map((code) => (
        <span
          key={code}
          className="flex items-center gap-1 rounded-full border border-(--color-ink)/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-(--color-ink-soft)"
        >
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          {DAY_LABELS[code]}
        </span>
      ))}
    </div>
  )
}

/** Bloque de info de un producto (nombre, precio, presentaciones) — compartido entre la fila de lista y la tarjeta de galería. */
function ItemDetails({ item }: { item: MenuItem }) {
  const subtitleParts: string[] = []
  if (item.flavors && item.flavors.length > 0) subtitleParts.push(item.flavors.join(', '))
  if (item.note) subtitleParts.push(item.note)

  return (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <span className="flex items-center gap-1.5 font-display text-lg text-(--color-ink)">
          {item.name}
          {item.featured && <img src={asset('/images/Icons/CerezaIcon.png')} alt="Destacado" className="h-8 w-8" />}
        </span>
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

      {item.soldOut && <p className="text-xs font-medium text-(--color-wine-deep)">Agotado</p>}

      <DaysBadge days={item.availableDays} />
    </>
  )
}

/** Bloque de info de una promoción — compartido entre la fila de lista y la tarjeta de galería. */
function PromotionDetails({ promo }: { promo: Promotion }) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-lg text-(--color-ink)">{promo.title}</span>
        {promo.price != null && <span className="flex-none font-medium text-(--color-ink)">{formatCurrency(promo.price)}</span>}
      </div>
      {promo.description && <p className="text-sm text-(--color-ink-soft)">{promo.description}</p>}

      {promo.soldOut && <p className="text-xs font-medium text-(--color-wine-deep)">Agotado</p>}

      <DaysBadge days={promo.availableDays} />
    </>
  )
}

/**
 * Fila de producto: lista plana, sin tarjeta ni miniatura — igual que el
 * menú de referencia del negocio. Si el producto tiene una sola opción de
 * precio, se muestra a la derecha del nombre; si tiene varias (tamaños,
 * presentaciones, o sabores con precio distinto), cada una se lista debajo
 * con su propio precio, sin necesidad de abrir el detalle para verlos.
 */
function MenuRow({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full flex-col gap-1 border-b border-(--color-line) py-4 text-left transition-colors last:border-b-0 hover:bg-(--color-cream-dim)/50"
    >
      <ItemDetails item={item} />
    </button>
  )
}

function PromotionRow({ promo, onOpen }: { promo: Promotion; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full flex-col gap-1 border-b border-(--color-line) py-4 text-left transition-colors last:border-b-0 hover:bg-(--color-cream-dim)/50"
    >
      <PromotionDetails promo={promo} />
    </button>
  )
}

/** Precio + texto del botón de una tarjeta de galería, según tenga una opción, varias, o sea a cotizar. */
function galleryPriceInfo(item: MenuItem): { price: string; cta: string } {
  if (item.customQuote) return { price: 'Cotización', cta: 'Personalizar' }
  if (item.options.length <= 1) {
    return { price: formatCurrency(item.options[0]?.price ?? 0), cta: 'Agregar al carrito' }
  }
  const min = Math.min(...item.options.map((o) => o.price))
  return { price: `Desde ${formatCurrency(min)}`, cta: 'Seleccionar opciones' }
}

/**
 * Tarjeta de galería: foto cuadrada arriba, nombre/estrellas/precio y un
 * botón centrados debajo — pensada para verse en cuadrícula (2 columnas en
 * móvil, 4 en escritorio). Toda la tarjeta abre el mismo modal que la vista
 * de lista; el "botón" de abajo es visual, no un control aparte.
 */
function GalleryProductCard({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  const { price, cta } = galleryPriceInfo(item)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col overflow-hidden rounded-2xl border border-(--color-line) bg-(--color-paper) text-left shadow-(--shadow-soft) transition-transform active:scale-[0.98]"
    >
      <ImageSlot src={item.image ?? DEMO_GALLERY_IMAGE} alt={item.name} placeholderLabel={item.name} className="aspect-square w-full" />
      <div className="flex flex-1 flex-col items-center gap-1.5 px-3 py-4 text-center">
        <p className="flex h-10 items-center gap-1 overflow-hidden font-display text-base leading-tight text-(--color-wine-deep) sm:h-12 sm:text-lg">
          {item.name}
          {item.featured && <img src={asset('/images/Icons/CerezaIcon.png')} alt="Destacado" className="h-5 w-5 flex-none" />}
        </p>
        <StarRating avg={item.rating?.avg ?? 0} count={item.rating?.count ?? 0} />
        <p className="text-sm font-medium text-(--color-ink) sm:text-base">{price}</p>
        <span
          className={`mt-1 w-full rounded-full px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm ${
            item.soldOut
              ? 'bg-(--color-cream-dim) text-(--color-ink-soft)'
              : 'bg-(--color-cream-dim) text-(--color-ink) group-hover:bg-(--color-wine)'
          }`}
        >
          {item.soldOut ? 'Agotado' : cta}
        </span>
      </div>
    </button>
  )
}

function GalleryPromotionCard({ promo, onOpen }: { promo: Promotion; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col overflow-hidden rounded-2xl border border-(--color-line) bg-(--color-paper) text-left shadow-(--shadow-soft) transition-transform active:scale-[0.98]"
    >
      <ImageSlot src={promo.image ?? DEMO_GALLERY_IMAGE} alt={promo.title} placeholderLabel={promo.title} className="aspect-square w-full" />
      <div className="flex flex-1 flex-col items-center gap-1.5 px-3 py-4 text-center">
        <p className="flex h-10 items-center overflow-hidden font-display text-base leading-tight text-(--color-wine-deep) sm:h-12 sm:text-lg">
          {promo.title}
        </p>
        <StarRating avg={promo.rating?.avg ?? 0} count={promo.rating?.count ?? 0} />
        {promo.price != null && <p className="text-sm font-medium text-(--color-ink) sm:text-base">{formatCurrency(promo.price)}</p>}
        <span
          className={`mt-1 w-full rounded-full px-3 py-2.5 text-xs font-medium text-(--color-ink) transition-colors sm:text-sm ${
            promo.soldOut ? 'bg-(--color-cream-dim)' : 'bg-(--color-cream-dim) group-hover:bg-(--color-wine)'
          }`}
        >
          {promo.soldOut ? 'Agotado' : 'Agregar al carrito'}
        </span>
      </div>
    </button>
  )
}

/**
 * El menú completo. Nav superior para saltar entre categorías. La forma en
 * que se pinta cada producto/promoción depende de `catalog.catalogView`,
 * controlado desde el panel: "list" (fila de texto, sin fotos) o "gallery"
 * (tarjeta con foto grande, apiladas verticalmente). Las promociones son la
 * primera sección en ambos casos, igual que en el menú real del negocio.
 */
export function Catalog() {
  const { catalog } = useCatalog()
  const [activeItem, setActiveItem] = useState<{ item: MenuItem; categoryName: string } | null>(null)
  const [activePromo, setActivePromo] = useState<Promotion | null>(null)
  const isGallery = catalog.catalogView === 'gallery'

  const jumpTargets = [
    ...(catalog.promotions.length > 0 ? [{ id: PROMOTIONS_ID, name: 'Promociones' }] : []),
    ...catalog.categories.map((c) => ({ id: c.id, name: c.name })),
  ]

  return (
    <section id="menu" className="bg-(--color-cream)">
      <div className="sticky top-[64px] z-30 border-b border-(--color-line) bg-(--color-cream)/95 backdrop-blur lg:top-[76px]">
        <nav className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-6 py-5 lg:justify-center lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {jumpTargets.map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={() => scrollToSection(target.id)}
              className="flex-none text-base text-(--color-ink-soft) transition-colors hover:text-(--color-sage)"
            >
              {target.name}
            </button>
          ))}
        </nav>
      </div>

      <div className={isGallery ? 'mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10' : 'mx-auto max-w-2xl px-6 py-10 lg:px-0'}>
        {catalog.promotions.length > 0 && (
          <div id={`cat-${PROMOTIONS_ID}`} className="mb-10 scroll-mt-32">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-(--color-sage)">Promociones</h2>
            <div className={isGallery ? 'mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6' : 'mt-2'}>
              {catalog.promotions.map((promo) =>
                isGallery ? (
                  <GalleryPromotionCard key={promo.id} promo={promo} onOpen={() => setActivePromo(promo)} />
                ) : (
                  <PromotionRow key={promo.id} promo={promo} onOpen={() => setActivePromo(promo)} />
                ),
              )}
            </div>
          </div>
        )}

        {catalog.categories.map((category) => (
          <div key={category.id} id={`cat-${category.id}`} className="mb-10 scroll-mt-32">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-(--color-sage)">{category.name}</h2>
            {category.description && <p className="mt-1 text-sm text-(--color-ink-soft)">{category.description}</p>}
            <div className={isGallery ? 'mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6' : 'mt-2'}>
              {category.items.map((item) =>
                isGallery ? (
                  <GalleryProductCard
                    key={item.id}
                    item={item}
                    onOpen={() => setActiveItem({ item, categoryName: category.name })}
                  />
                ) : (
                  <MenuRow key={item.id} item={item} onOpen={() => setActiveItem({ item, categoryName: category.name })} />
                ),
              )}
            </div>
          </div>
        ))}

        {catalog.categories.length === 0 && (
          <p className="text-center text-(--color-ink-soft)">El menú no está disponible por ahora.</p>
        )}
      </div>

      {activeItem && (
        <ProductModal item={activeItem.item} categoryName={activeItem.categoryName} onClose={() => setActiveItem(null)} />
      )}

      {activePromo && <PromotionModal promo={activePromo} onClose={() => setActivePromo(null)} />}
    </section>
  )
}
