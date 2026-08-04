import { MapPin } from 'lucide-react'
import { BUSINESS } from '../data/business'
import { asset } from '../utils/asset'
import { FacebookIcon } from './icons/FacebookIcon'
import { InstagramIcon } from './icons/InstagramIcon'

export function Footer() {
  return (
    <footer className="border-t border-(--color-line) bg-(--color-cream-dim)">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-center lg:px-10">
        <a href="#top" className="flex items-center">
          <img
            src={asset('/images/logo/logo.png')}
            alt={`${BUSINESS.name} · ${BUSINESS.tagline}`}
            className="h-11 w-auto"
          />
        </a>

        <div className="flex items-center gap-3">
          <a
            href={BUSINESS.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram de Fábrica de Postres"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-(--color-ink)/15 text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a
            href={BUSINESS.facebookUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook de Fábrica de Postres"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-(--color-ink)/15 text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
          >
            <FacebookIcon className="h-4 w-4" />
          </a>
          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Ubicación en Google Maps"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-(--color-ink)/15 text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
          >
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <div className="border-t border-(--color-line) px-6 py-6 text-center text-xs text-(--color-ink-soft) lg:px-10">
        © {new Date().getFullYear()} {BUSINESS.name} {BUSINESS.tagline}. Todos los derechos reservados.
        <br />
        {BUSINESS.address}
      </div>
    </footer>
  )
}
