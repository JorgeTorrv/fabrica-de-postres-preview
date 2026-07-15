import { Star } from 'lucide-react'
import { BUSINESS } from '../data/business'

const REVIEWS = [
  {
    quote:
      'Sin duda cinco estrellas. Llevo más de diez años siendo clienta de Fábrica de Postres. Han estado en mis cumpleaños y en cada momento especial.',
    author: 'Mayra Pérez',
    offset: '',
  },
  {
    quote:
      'Todo está delicioso. Compré galletas y rebanadas de cheesecake. Las galletas están muy suaves, fueron mis favoritas. La atención es excelente.',
    author: 'Berenice Resendiz',
    offset: 'lg:translate-y-10',
  },
  {
    quote:
      'Pedí galletas de diferentes sabores y estaban deliciosas. Muy rico el pastel y la atención que dan es de primera.',
    author: 'Cliente frecuente',
    offset: '',
  },
]

export function Reviews() {
  return (
    <section id="opiniones" className="bg-(--color-cream-dim) py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="font-display text-balance text-4xl font-light text-(--color-ink) sm:text-5xl">
            Lo que dicen
            <br />
            nuestros clientes
          </h2>
          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-(--color-ink-soft) transition-colors hover:text-(--color-wine)"
          >
            <Star className="h-4 w-4 fill-(--color-gold) text-(--color-gold)" strokeWidth={0} />
            {BUSINESS.rating} · {BUSINESS.reviewCount} opiniones en Google Maps
          </a>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <figure key={review.author} className={review.offset}>
              <span className="font-display text-6xl leading-none text-(--color-gold-soft)">“</span>
              <blockquote className="mt-2 font-display text-xl leading-relaxed text-(--color-ink)">
                {review.quote}
              </blockquote>
              <figcaption className="mt-5 text-sm text-(--color-ink-soft)">{review.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
