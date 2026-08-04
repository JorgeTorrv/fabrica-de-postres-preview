import { Phone } from 'lucide-react'
import { BUSINESS } from '../data/business'
import { ImageSlot } from './ImageSlot'

function scrollToMenu() {
  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Hero compacto: una pantalla corta con mensaje breve e imagen, sin quitarle
 * protagonismo al menú que viene justo debajo. La historia de la marca y
 * las redes sociales viven en secciones propias más abajo, no aquí.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-10 lg:pt-36 lg:pb-14">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-10">
        <div className="animate-fade-up">
          <h1 className="font-display text-balance text-4xl font-light leading-[1.1] text-(--color-ink) sm:text-5xl">
            Endulzamos cada momento en <span className="text-(--color-wine)">Tampico</span>
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-(--color-ink-soft)">
            Pasteles, cheesecakes, galletas y cafetería. Pide en línea y recibe por WhatsApp.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={scrollToMenu}
              className="rounded-full bg-(--color-wine) px-7 py-3.5 text-sm font-medium text-(--color-cream) shadow-(--shadow-soft) transition-transform hover:-translate-y-0.5 hover:bg-(--color-wine-deep)"
            >
              Ver menú y pedir
            </button>
            <a
              href={`tel:+52${BUSINESS.whatsapp.slice(2)}`}
              className="flex items-center gap-2 rounded-full border border-(--color-ink)/15 px-7 py-3.5 text-sm font-medium text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
            >
              <Phone className="h-4 w-4" strokeWidth={1.5} />
              Llamar ahora
            </a>
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <ImageSlot
            src="/images/hero/hero-principal.jpg"
            alt="Selección de postres de Fábrica de Postres"
            placeholderLabel="hero/hero-principal.jpg — foto ancha de mesa de postres"
            className="aspect-[16/10] w-full rounded-[2rem] shadow-(--shadow-lift)"
          />
        </div>
      </div>
    </section>
  )
}
