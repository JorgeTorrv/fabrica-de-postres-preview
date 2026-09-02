/**
 * Cloudflare Turnstile en modo invisible — el sitekey ya está configurado
 * como "invisible" del lado de Cloudflare, así que nunca aparece UI (ni
 * checkbox); esto solo frena scripts/bots, nunca a una persona real.
 */
const SITE_KEY = '0x4AAAAAAElHnvFExXD2sZ8a'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
const CHALLENGE_TIMEOUT_MS = 8000

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      remove: (widgetId: string) => void
    }
  }
}

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null // permite reintentar si la red falló
      reject(new Error('No se pudo cargar Turnstile'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

/**
 * Precarga el script de Turnstile (sin ejecutar el reto todavía) — llamar
 * apenas se muestra la UI de calificación, para que la primera vez que el
 * usuario toque una estrella el script ya esté listo y no cuente contra el
 * timeout del reto en sí. Antes, un primer reto "en frío" (script recién
 * pedido + challenge) a veces tardaba más que el timeout y fallaba
 * silenciosamente, obligando a un segundo tap para que sí se guardara.
 */
export function preloadTurnstile(): void {
  loadScript().catch(() => {
    // Si falla, getTurnstileToken lo vuelve a intentar cuando de verdad se necesite.
  })
}

function runChallenge(): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    const container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    const timeout = setTimeout(() => {
      cleanup()
      resolve(null)
    }, CHALLENGE_TIMEOUT_MS)

    const cleanup = () => {
      clearTimeout(timeout)
      container.remove()
    }

    window.turnstile!.render(container, {
      sitekey: SITE_KEY,
      callback: (token: string) => {
        cleanup()
        resolve(token)
      },
      'error-callback': () => {
        cleanup()
        resolve(null)
      },
    })
  })
}

/**
 * Ejecuta el reto invisible y devuelve el token, o null si falla/tarda
 * demasiado dos veces seguidas. Reintenta una vez internamente (todo dentro
 * de la misma llamada, sin que el usuario tenga que volver a tocar nada) —
 * un primer intento "en frío" puede fallar por lentitud de red aunque el
 * segundo, ya con todo cargado, funcione al toque.
 */
export async function getTurnstileToken(): Promise<string | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await loadScript()
      if (!window.turnstile) continue
      const token = await runChallenge()
      if (token) return token
    } catch {
      // sigue al siguiente intento
    }
  }
  return null
}
