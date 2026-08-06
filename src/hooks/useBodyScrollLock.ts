import { useEffect } from 'react'

/**
 * Bloquea el scroll de la página mientras un overlay de pantalla completa
 * está abierto. Sin esto, deslizar dentro del overlay también mueve el
 * fondo detrás (el drawer/modal no tiene su propio "piso" de scroll), lo
 * que se siente raro sobre todo al llegar a los bordes.
 */
export function useBodyScrollLock(active: boolean = true) {
  useEffect(() => {
    if (!active) return
    // document.scrollingElement es <html>, no <body> — bloquear solo el
    // body no evita que la página se siga moviendo detrás del overlay.
    const html = document.documentElement
    const previousHtml = html.style.overflow
    const previousBody = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = previousHtml
      document.body.style.overflow = previousBody
    }
  }, [active])
}
