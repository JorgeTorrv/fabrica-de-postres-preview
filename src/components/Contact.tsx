import { Clock, MapPin, Phone } from 'lucide-react'
import { BUSINESS } from '../data/business'

const DETAILS = [
  { icon: MapPin, label: 'Dirección', value: BUSINESS.address },
  { icon: Phone, label: 'Teléfono', value: BUSINESS.phoneDisplay },
  { icon: Clock, label: 'Horario', value: BUSINESS.hours },
]

export function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-balance text-4xl font-light text-(--color-ink) sm:text-5xl">
            Encuéntranos en {BUSINESS.city}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-(--color-ink-soft)">
            Estamos en Lomas de Rosales, listos para endulzar tu día. También puedes hacer tu
            pedido por teléfono o Facebook.
          </p>

          <div className="mt-10 flex flex-col gap-6">
            {DETAILS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4 border-t border-(--color-line) pt-6 first:border-t-0 first:pt-0">
                <Icon className="mt-1 h-5 w-5 flex-none text-(--color-wine-deep)" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-(--color-ink-soft)">{label}</p>
                  <p className="mt-0.5 font-display text-lg text-(--color-ink)">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-(--shadow-lift) sm:aspect-square">
          <iframe
            title={`Ubicación de ${BUSINESS.name} en el mapa`}
            src={BUSINESS.mapsEmbedUrl}
            className="pointer-events-none h-full w-full grayscale-[15%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir ${BUSINESS.name} en Google Maps`}
            className="absolute inset-0"
          />
        </div>
      </div>
    </section>
  )
}
