/**
 * Cloudflare Turnstile en modo invisible — el sitekey ya está configurado
 * como "invisible" del lado de Cloudflare, así que nunca aparece UI (ni
 * checkbox); esto solo frena scripts/bots, nunca a una persona real.
 */
const SITE_KEY = '0x4AAAAAAEZvq50njP9jfj0c'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

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
    script.onerror = () => reject(new Error('No se pudo cargar Turnstile'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

/** Ejecuta el reto invisible y devuelve el token, o null si falla/tarda demasiado. */
export async function getTurnstileToken(): Promise<string | null> {
  try {
    await loadScript()
    if (!window.turnstile) return null

    return await new Promise<string | null>((resolve) => {
      const container = document.createElement('div')
      container.style.display = 'none'
      document.body.appendChild(container)

      const timeout = setTimeout(() => {
        cleanup()
        resolve(null)
      }, 6000)

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
  } catch {
    return null
  }
}
