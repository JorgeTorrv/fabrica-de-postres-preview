import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ImageSlot } from './ImageSlot'

const CAROUSEL_IMAGES = Array.from({ length: 6 }, (_, i) => ({
  src: `/images/gallery/carousel/momento-${i + 1}.jpg`,
  alt: `Momento destacado ${i + 1} en Fábrica de Postres`,
}))

// Duplicated once so the marquee can loop seamlessly (-50% == one full set).
const MARQUEE_IMAGES = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES]

const GRID_IMAGES = Array.from({ length: 10 }, (_, i) => ({
  src: `/images/gallery/grid/galeria-${i + 1}.jpg`,
  alt: `Trabajo ${i + 1} de Fábrica de Postres`,
}))

export function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const showLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const stepLightbox = (direction: 1 | -1) => {
    setLightboxIndex((current) => {
      if (current === null) return current
      const next = (current + direction + GRID_IMAGES.length) % GRID_IMAGES.length
      return next
    })
  }

  return (
    <section id="galeria" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-balance text-4xl font-light text-(--color-ink) sm:text-5xl">
          Momentos que
          <br />
          hemos endulzado
        </h2>
      </div>

      <div className="marquee-group group mt-10 overflow-hidden">
        <div className="animate-marquee flex w-max gap-5">
          {MARQUEE_IMAGES.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              aria-hidden={index >= CAROUSEL_IMAGES.length}
              className="w-[72vw] flex-none sm:w-[360px]"
            >
              <ImageSlot
                src={image.src}
                alt={image.alt}
                placeholderLabel={image.src.replace('/images/', '')}
                className="aspect-[4/5] w-full rounded-3xl"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {GRID_IMAGES.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => showLightbox(index)}
              className={`overflow-hidden rounded-xl ${index % 7 === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <ImageSlot
                src={image.src}
                alt={image.alt}
                placeholderLabel={image.src.replace('/images/', '')}
                className="aspect-square w-full transition-transform duration-500 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-ink)/90 p-6"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Cerrar"
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full text-(--color-cream) hover:bg-(--color-cream)/10"
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              stepLightbox(-1)
            }}
            aria-label="Anterior"
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full text-(--color-cream) hover:bg-(--color-cream)/10 sm:left-8"
          >
            <ChevronLeft className="h-7 w-7" strokeWidth={1.5} />
          </button>

          <div className="max-h-[80vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <ImageSlot
              src={GRID_IMAGES[lightboxIndex].src}
              alt={GRID_IMAGES[lightboxIndex].alt}
              placeholderLabel={GRID_IMAGES[lightboxIndex].src.replace('/images/', '')}
              className="max-h-[80vh] w-full rounded-2xl"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              stepLightbox(1)
            }}
            aria-label="Siguiente"
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full text-(--color-cream) hover:bg-(--color-cream)/10 sm:right-8"
          >
            <ChevronRight className="h-7 w-7" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </section>
  )
}
