import { MapPin, Phone } from 'lucide-react'
import { BUSINESS } from '../data/business'
import { ImageSlot } from './ImageSlot'
import { FacebookIcon } from './icons/FacebookIcon'
import { InstagramIcon } from './icons/InstagramIcon'

type HeroProps = {
  onOpenMenu: () => void
}

export function Hero({ onOpenMenu }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-10">
        <div className="animate-fade-up">
          <h1 className="font-display text-balance text-[2.75rem] font-light leading-[1.08] text-(--color-ink) sm:text-6xl lg:text-[4rem]">
            Endulzamos cada
            <br />
            momento especial
            <br />
            en <span className="text-(--color-wine)">Tampico</span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-(--color-ink-soft)">
            Pastelería artesanal, eventos y cafetería. Desde pasteles y cheesecakes hasta galletas
            irresistibles, llevamos más de {BUSINESS.yearsExperience} años endulzando la ciudad.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenMenu}
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

          <div className="mt-10 flex flex-col gap-4 text-sm text-(--color-ink-soft)">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                {BUSINESS.city}, Lomas de Rosales
              </span>
              <span>{BUSINESS.hoursShort}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Síguenos en nuestras redes</span>
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram de Fábrica de Postres"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-(--color-ink)/15 text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={BUSINESS.facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook de Fábrica de Postres"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-(--color-ink)/15 text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:150ms]">
          <ImageSlot
            src="/images/hero/hero-principal.jpg"
            alt="Selección de postres de Fábrica de Postres"
            placeholderLabel="hero/hero-principal.jpg — foto ancha de mesa de postres"
            className="aspect-[4/5] w-full rounded-[2rem] shadow-(--shadow-lift) sm:aspect-[5/4]"
          />
          <div className="absolute -bottom-8 -left-8 hidden w-44 -rotate-3 sm:block">
            <ImageSlot
              src="/images/hero/hero-detalle.jpg"
              alt="Detalle de un postre de Fábrica de Postres"
              placeholderLabel="hero/hero-detalle.jpg"
              className="aspect-square w-full rounded-2xl border-4 border-(--color-cream) shadow-(--shadow-soft)"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
