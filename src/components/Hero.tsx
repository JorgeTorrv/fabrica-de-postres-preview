import { Clock, MapPin } from 'lucide-react'
import { BUSINESS } from '../data/business'
import { asset } from '../utils/asset'

function scrollToMenu() {
  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Pantalla de bienvenida a pantalla completa: lo único visible al cargar la
 * página (nada de menú a la vista todavía). Logo grande, un botón que hace
 * scroll suave al catálogo, y dos datos rápidos (horario, dirección). El
 * header con navegación aparece recién cuando el usuario hace scroll (ver
 * Header.tsx) — aquí no debe competir con el logo.
 */
export function Hero() {
  return (
    <section id="top" className="flex min-h-dvh flex-col items-center justify-center gap-10 px-6 py-12 text-center">
      <img
        src={asset('/images/logo/logo.png')}
        alt={`${BUSINESS.name} · ${BUSINESS.tagline}`}
        className="w-full max-w-xs sm:max-w-sm"
      />

      <div className="flex w-full max-w-sm flex-col gap-3">
        <button
          type="button"
          onClick={scrollToMenu}
          className="w-full rounded-full bg-(--color-wine) px-7 py-4 text-sm font-semibold uppercase tracking-wide text-(--color-cream) transition-colors hover:bg-(--color-wine-deep)"
        >
          Ver menú
        </button>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-(--color-ink)/15 px-4 py-3 text-xs font-medium uppercase tracking-wide text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
          >
            <Clock className="h-4 w-4 flex-none" strokeWidth={1.5} />
            <span className="truncate">Horarios</span>
          </a>
          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-(--color-ink)/15 px-4 py-3 text-xs font-medium uppercase tracking-wide text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine)"
          >
            <MapPin className="h-4 w-4 flex-none" strokeWidth={1.5} />
            <span className="truncate">{BUSINESS.city}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
