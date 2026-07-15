import { BUSINESS } from '../data/business'
import { ImageSlot } from './ImageSlot'

const STATS = [
  { value: `+${BUSINESS.yearsExperience}`, label: 'Años de experiencia' },
  { value: BUSINESS.eventsCount, label: 'Eventos endulzados' },
  { value: BUSINESS.rating.toFixed(1), label: 'Calificación promedio' },
]

export function Story() {
  return (
    <section id="historia" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div className="relative pb-12 sm:pb-0">
          <ImageSlot
            src="/images/story/story-taller.jpg"
            alt="Preparando postres en el taller de Fábrica de Postres"
            placeholderLabel="story/story-taller.jpg"
            className="aspect-[4/5] w-full rounded-[2rem] sm:w-4/5"
          />
          <div className="absolute -bottom-6 right-2 w-1/3 rotate-2 sm:-bottom-10 sm:right-0 sm:w-2/5">
            <ImageSlot
              src="/images/story/story-detalle.jpg"
              alt="Detalle artesanal de un postre"
              placeholderLabel="story/story-detalle.jpg"
              className="aspect-square w-full rounded-2xl border-4 border-(--color-cream) shadow-(--shadow-soft)"
            />
          </div>
        </div>

        <div className="lg:pl-6">
          <h2 className="font-display text-balance text-4xl font-light leading-tight text-(--color-ink) sm:text-5xl">
            De Facebook a tu pastelería de confianza
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-(--color-ink-soft)">
            {BUSINESS.name} comenzó ofreciendo postres por Facebook. Con el cariño de nuestros
            clientes crecimos hasta abrir nuestro propio local en Lomas de Rosales, Tampico.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-(--color-ink-soft)">
            Hoy seguimos endulzando cumpleaños, reuniones y momentos especiales con pasteles,
            galletas, cheesecakes y postres que llevan el sabor de casa.
          </p>

          <dl className="mt-12 grid grid-cols-3 divide-x divide-(--color-line)">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-3 first:pl-0 sm:px-4">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-3xl text-(--color-wine) sm:text-4xl">{stat.value}</dd>
                <dd className="mt-1 text-xs text-(--color-ink-soft) sm:text-sm">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
