/**
 * Temporal: las variantes de rosa salmón probadas (ver comentario en
 * global.css). El toggle en Ajustes del panel cambia esto en vivo sin
 * rebuild, sobreescribiendo las custom properties de CSS en el documento.
 * "custom" deriva las tres variantes (fondo/texto/tinte suave) de
 * cualquier RGB que se haya guardado desde Ajustes, con la misma lógica
 * que se usó a mano para las variantes fijas: mismo tono, más oscuro y
 * algo menos saturado hasta pasar contraste 4.5:1 contra el beige de
 * fondo.
 */
export type AccentColor = 'bright' | 'terracotta' | 'coral' | 'custom'

type Shades = { wine: string; wineDeep: string; wineSoft: string }

const FIXED_VARIANTS: Record<Exclude<AccentColor, 'custom'>, Shades> = {
  bright: { wine: '#ff91a4', wineDeep: '#b1253e', wineSoft: '#ffb2c0' },
  terracotta: { wine: '#b97876', wineDeep: '#7a403e', wineSoft: '#d4acab' },
  coral: { wine: '#eb989f', wineDeep: '#a2202b', wineSoft: '#f3bfc3' },
}

export function parseAccentColor(value?: string): AccentColor {
  if (value === 'terracotta') return 'terracotta'
  if (value === 'coral') return 'coral'
  if (value === 'custom') return 'custom'
  return 'bright'
}

// --- color math (hex <-> HSL, contraste WCAG) ---

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)]
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [h, s, l]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let [r, g, b] = [0, 0, 0]
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255]
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA)
  const l2 = relativeLuminance(hexB)
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

const CREAM_BG = '#f7ece4'

/** Oscurece manteniendo el tono hasta pasar 4.5:1 de contraste contra el fondo (para texto/íconos legibles). */
function deriveDeep(baseHex: string): string {
  const [r, g, b] = hexToRgb(baseHex)
  const [h, s] = rgbToHsl(r, g, b)
  let l = rgbToHsl(r, g, b)[2]
  let sat = s
  for (let i = 0; i < 40 && l > 0.15; i++) {
    l -= 0.02
    sat = Math.max(0.35, sat - 0.01)
    const [rr, gg, bb] = hslToRgb(h, sat, l)
    const hex = rgbToHex(rr, gg, bb)
    if (contrastRatio(hex, CREAM_BG) >= 4.5) return hex
  }
  const [rr, gg, bb] = hslToRgb(h, sat, Math.max(0.15, l))
  return rgbToHex(rr, gg, bb)
}

/** Aclara manteniendo el tono — tinte suave sin requisito de contraste, reservado para uso futuro. */
function deriveSoft(baseHex: string): string {
  const [r, g, b] = hexToRgb(baseHex)
  const [h, s] = rgbToHsl(r, g, b)
  const [rr, gg, bb] = hslToRgb(h, s, 0.85)
  return rgbToHex(rr, gg, bb)
}

export function deriveAccentShades(baseHex: string): Shades {
  return { wine: baseHex, wineDeep: deriveDeep(baseHex), wineSoft: deriveSoft(baseHex) }
}

export function applyAccentColor(variant: AccentColor, customHex?: string) {
  const shades = variant === 'custom' ? deriveAccentShades(customHex || '#ff91a4') : FIXED_VARIANTS[variant]
  const root = document.documentElement.style
  root.setProperty('--color-wine', shades.wine)
  root.setProperty('--color-wine-deep', shades.wineDeep)
  root.setProperty('--color-wine-soft', shades.wineSoft)
}

/**
 * Temporal: variantes de verde probadas. Afecta TODO lo verde del sitio —
 * nombres de categoría, precios, y el borde de las tarjetas de galería
 * (que sigue siempre a --color-sage, ya no hay un tono de borde aparte).
 * Sin variante "deep" — el verde ya se usa directo como texto/borde en
 * los dos casos fijos, ambos con contraste suficiente de fábrica.
 */
export type SageColor = 'current' | 'new' | 'custom'

const SAGE_VARIANTS: Record<Exclude<SageColor, 'custom'>, string> = {
  current: '#2f4015',
  new: '#008f39',
}

export function parseSageColor(value?: string): SageColor {
  if (value === 'new') return 'new'
  if (value === 'custom') return 'custom'
  return 'current'
}

export function applySageColor(variant: SageColor, customHex?: string) {
  const hex = variant === 'custom' ? customHex || '#2f4015' : SAGE_VARIANTS[variant]
  document.documentElement.style.setProperty('--color-sage', hex)
}
