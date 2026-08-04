import { Phone } from 'lucide-react'
import { BUSINESS } from '../data/business'

/**
 * Franja mínima, sin imagen: el catálogo es el protagonista y empieza justo
 * debajo. Solo el nombre, una línea de contexto y el teléfono — nada que
 * compita por atención con el menú.
 */
export function Hero() {
  return (
    <section id="top" className="border-b border-(--color-line) px-6 pb-6 pt-28 text-center lg:pt-32">
      <h1 className="font-display text-3xl text-(--color-ink) sm:text-4xl">{BUSINESS.name}</h1>
      <p className="mt-2 text-sm text-(--color-ink-soft)">
        Pasteles, cheesecakes, galletas y cafetería en {BUSINESS.city}. Pide en línea, recibe por WhatsApp.
      </p>
      <a
        href={`tel:+52${BUSINESS.whatsapp.slice(2)}`}
        className="mt-3 inline-flex items-center gap-1.5 text-sm text-(--color-wine) hover:underline"
      >
        <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
        {BUSINESS.phoneDisplay}
      </a>
    </section>
  )
}
