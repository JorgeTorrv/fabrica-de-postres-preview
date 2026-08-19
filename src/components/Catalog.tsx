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

      {item.soldOut && <p className="text-xs font-medium text-(--color-wine)">Agotado</p>}

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

      {promo.soldOut && <p className="text-xs font-medium text-(--color-wine)">Agotado</p>}

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

/**
 * Tarjeta de galería: la foto manda (arriba, grande), el nombre y las
 * presentaciones/precios van debajo. Toda la tarjeta abre el mismo modal
 * que la vista de lista.
 */
function GalleryProductCard({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full flex-col overflow-hidden rounded-2xl border border-(--color-line) bg-(--color-paper) text-left shadow-(--shadow-soft) transition-transform active:scale-[0.99]"
    >
      <ImageSlot
        src={item.image ?? DEMO_GALLERY_IMAGE}
        alt={item.name}
        placeholderLabel={item.name}
        className="h-60 w-full sm:h-72"
      />
      <div className="flex flex-col gap-1 px-5 py-4">
        <ItemDetails item={item} />
      </div>
    </button>
  )
}

function GalleryPromotionCard({ promo, onOpen }: { promo: Promotion; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full flex-col overflow-hidden rounded-2xl border border-(--color-line) bg-(--color-paper) text-left shadow-(--shadow-soft) transition-transform active:scale-[0.99]"
    >
      <ImageSlot
        src={promo.image ?? DEMO_GALLERY_IMAGE}
        alt={promo.title}
        placeholderLabel={promo.title}
        className="h-60 w-full sm:h-72"
      />
      <div className="flex flex-col gap-1 px-5 py-4">
        <PromotionDetails promo={promo} />
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
    <section id="menu" className="bg-white">
      <div className="sticky top-[64px] z-30 border-b border-(--color-line) bg-white/95 backdrop-blur lg:top-[76px]">
        <nav className="mx-auto flex items-center gap-5 overflow-x-auto px-6 py-5 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {jumpTargets.map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={() => scrollToSection(target.id)}
              className="flex-none text-base text-(--color-ink-soft) transition-colors hover:text-(--color-wine)"
            >
              {target.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10 lg:px-0">
        {catalog.promotions.length > 0 && (
          <div id={`cat-${PROMOTIONS_ID}`} className="mb-10 scroll-mt-32">
            <h2 className="font-display text-2xl uppercase tracking-wide text-(--color-wine)">Promociones</h2>
            <div className={isGallery ? 'mt-4 flex flex-col gap-6' : 'mt-2'}>
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
            <h2 className="font-display text-2xl uppercase tracking-wide text-(--color-wine)">{category.name}</h2>
            {category.description && <p className="mt-1 text-sm text-(--color-ink-soft)">{category.description}</p>}
            <div className={isGallery ? 'mt-4 flex flex-col gap-6' : 'mt-2'}>
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
