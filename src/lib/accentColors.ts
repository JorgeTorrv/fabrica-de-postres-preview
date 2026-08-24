/**
 * Temporal: las dos variantes de rosa salmón probadas (ver comentario en
 * global.css). El toggle en Ajustes del panel cambia esto en vivo sin
 * rebuild, sobreescribiendo las custom properties de CSS en el documento.
 */
export type AccentColor = 'bright' | 'terracotta'

const VARIANTS: Record<AccentColor, { wine: string; wineDeep: string; wineSoft: string }> = {
  bright: { wine: '#ff91a4', wineDeep: '#b1253e', wineSoft: '#ffb2c0' },
  terracotta: { wine: '#b97876', wineDeep: '#7a403e', wineSoft: '#d4acab' },
}

export function applyAccentColor(variant: AccentColor) {
  const { wine, wineDeep, wineSoft } = VARIANTS[variant]
  const root = document.documentElement.style
  root.setProperty('--color-wine', wine)
  root.setProperty('--color-wine-deep', wineDeep)
  root.setProperty('--color-wine-soft', wineSoft)
}
