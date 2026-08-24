import { Star } from 'lucide-react'

type Fill = 'empty' | 'half' | 'full'

function fillAt(value: number, index: number): Fill {
  const remaining = value - index
  if (remaining >= 1) return 'full'
  if (remaining >= 0.5) return 'half'
  return 'empty'
}

/**
 * Una estrella, tamaño fijo (`sizeClass` define un box de ancho/alto
 * iguales). El relleno "half" se logra recortando al 50% un ícono de
 * relleno absoluto DENTRO de esa única estrella — nunca recortando una fila
 * de varias estrellas con un ancho en %, que en flexbox puede terminar
 * encogiendo cada ícono de forma desigual según el navegador.
 */
function OneStar({ fill, sizeClass }: { fill: Fill; sizeClass: string }) {
  if (fill === 'full') {
    return <Star className={`${sizeClass} flex-none text-(--color-gold)`} strokeWidth={1.5} fill="currentColor" />
  }
  if (fill === 'empty') {
    return <Star className={`${sizeClass} flex-none text-(--color-line)`} strokeWidth={1.5} fill="currentColor" />
  }
  return (
    <span className={`relative inline-flex flex-none ${sizeClass}`}>
      <Star className={`absolute inset-0 ${sizeClass} text-(--color-line)`} strokeWidth={1.5} fill="currentColor" />
      {/*
        El ícono de adentro debe medir lo mismo que uno completo (sizeClass)
        y NO h-full/w-full — si se le da el tamaño del contenedor recortado
        (50% de ancho) el propio SVG se encoge/deforma en vez de solo
        recortarse visualmente. Se deja a tamaño real y el overflow-hidden
        del contenedor de abajo tapa la mitad derecha.
      */}
      <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
        <Star className={`${sizeClass} text-(--color-gold)`} strokeWidth={1.5} fill="currentColor" />
      </span>
    </span>
  )
}

/** Fila de 5 estrellas representando `value` (0-5, en pasos de 0.5). */
export function StarRow({ value, sizeClass }: { value: number; sizeClass: string }) {
  return (
    <div className="flex">
      {[0, 1, 2, 3, 4].map((i) => (
        <OneStar key={i} fill={fillAt(value, i)} sizeClass={sizeClass} />
      ))}
    </div>
  )
}
