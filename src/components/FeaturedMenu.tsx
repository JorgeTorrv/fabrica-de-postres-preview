import { ImageSlot } from './ImageSlot'

type FeaturedMenuProps = {
  onOpenMenu: () => void
}

const FEATURED = [
  {
    name: 'Biscoff Lotus y Kinder Bueno',
    description: 'Capas de crema, galleta Lotus y Kinder Bueno. Un clásico irresistible.',
    image: '/images/featured/featured-biscoff.jpg',
  },
  {
    name: 'Cheesecake de pistache',
    description: 'Suave, cremoso y con trozos de nuez. Un toque elegante para cerrar cualquier comida.',
    image: '/images/featured/featured-pistache.jpg',
  },
  {
    name: 'Galletas artesanales',
    description: 'Grandes, suaves por dentro y en sabores que sorprenden. Perfectas para regalar.',
    image: '/images/featured/featured-galletas.jpg',
  },
]

export function FeaturedMenu({ onOpenMenu }: FeaturedMenuProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <h2 className="font-display text-balance text-4xl font-light text-(--color-ink) sm:text-5xl">
          Nuestros postres
          <br />
          más amados
        </h2>
        <p className="max-w-sm text-(--color-ink-soft)">
          Sabores que han conquistado {`Tampico`}, hechos con ingredientes de calidad y mucha
          dedicación.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {FEATURED.map((item) => (
          <div
            key={item.name}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl"
          >
            <ImageSlot
              src={item.image}
              alt={item.name}
              placeholderLabel={item.image.replace('/images/', '')}
              className="h-full w-full transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--color-ink)/80 via-(--color-ink)/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="font-display text-2xl text-(--color-cream)">{item.name}</h3>
              <p className="mt-2 max-w-xs text-sm text-(--color-cream)/85">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-full border border-(--color-ink)/15 px-8 py-3.5 text-sm font-medium text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
        >
          Ver menú completo
        </button>
      </div>
    </section>
  )
}
