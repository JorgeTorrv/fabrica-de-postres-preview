import { useState } from 'react'
import { asset } from '../utils/asset'

type ImageSlotProps = {
  /** Path under /public, e.g. "/images/hero/hero-principal.jpg" */
  src: string
  alt: string
  className?: string
  /** Shown inside the placeholder until the real photo is added at `src`. */
  placeholderLabel?: string
  /** "label" prints the expected filename (default), "monogram" prints initials — use for small slots like the logo. */
  variant?: 'label' | 'monogram'
}

/**
 * Renders the real photo once it exists at `src`. Until then, falls back to a
 * quiet labeled frame so it's obvious where each image belongs.
 */
export function ImageSlot({ src, alt, className = '', placeholderLabel, variant = 'label' }: ImageSlotProps) {
  const [failed, setFailed] = useState(false)

  // Sin `src` (producto sin foto todavía) va directo al placeholder: un
  // <img src=""> no dispara onError de forma confiable en todos los navegadores.
  if (failed || !src) {
    if (variant === 'monogram') {
      const initials = alt
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
      return (
        <div
          className={`flex items-center justify-center bg-(--color-wine) font-display text-sm text-(--color-ink) ${className}`}
        >
          {initials}
        </div>
      )
    }

    return (
      <div
        className={`placeholder-frame flex items-center justify-center border border-(--color-line) bg-(--color-cream-dim) ${className}`}
      >
        <p className="max-w-[70%] text-center font-display text-sm italic text-(--color-ink-soft)">
          {placeholderLabel ?? alt}
        </p>
      </div>
    )
  }

  return (
    <img
      src={asset(src)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`bg-(--color-cream-dim) object-cover ${className}`}
    />
  )
}
