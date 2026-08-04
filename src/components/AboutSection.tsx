import { BUSINESS } from '../data/business'

/**
 * "Sobre nosotros" mínimo: 2-3 líneas al final de la portada, ya no una
 * sección elaborada con estadísticas y doble imagen. El catálogo es el
 * protagonista del sitio, esto es solo contexto breve.
 */
export function AboutSection() {
  return (
    <section id="nosotros" className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-10">
      <h2 className="font-display text-2xl text-(--color-ink) sm:text-3xl">Sobre {BUSINESS.name}</h2>
      <p className="mt-4 text-base leading-relaxed text-(--color-ink-soft)">
        {BUSINESS.name} comenzó ofreciendo postres por Facebook y hoy tiene su propio local en
        Lomas de Rosales, Tampico. Seguimos endulzando cumpleaños, reuniones y momentos especiales
        con pasteles, galletas, cheesecakes y cafetería.
      </p>
    </section>
  )
}
