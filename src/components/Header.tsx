import { useEffect, useState } from 'react'
import { Phone, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { BUSINESS } from '../data/business'
import { asset } from '../utils/asset'

const NAV_LINKS = [
  { label: 'Menú', href: '#menu' },
  { label: 'Contacto', href: '#contacto' },
]

/**
 * Igual que `scrollToMenu` en Hero.tsx: salta a la primera sección `#cat-*`
 * (con su `scroll-mt-[150px]`) en vez de a `#menu` directo, para que el
 * header fijo + la barra sticky no tapen el nombre de la categoría.
 */
function handleMenuClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  const menu = document.getElementById('menu')
  if (!menu) return
  const firstSection = menu.querySelector('[id^="cat-"]')
  ;(firstSection ?? menu).scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { itemCount, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visible = scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-(--color-cream)/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:grid lg:grid-cols-3 lg:px-10">
        <a href="#top" className="flex items-center lg:justify-self-start">
          <img
            src={asset('/images/logo/logo.png')}
            alt="Fábrica de Postres · Eventos y Pastelería"
            className="h-11 w-auto lg:h-12"
          />
        </a>

        <nav className="hidden items-center gap-9 lg:flex lg:justify-self-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={link.href === '#menu' ? handleMenuClick : undefined}
              className="text-sm text-(--color-ink-soft) transition-colors hover:text-(--color-wine-deep)"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:justify-self-end">
          <button
            type="button"
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-(--color-ink) transition-colors hover:bg-(--color-cream-dim)"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-wine) text-[10px] font-medium text-(--color-ink)">
                {itemCount}
              </span>
            )}
          </button>

          <a
            href={`tel:+${BUSINESS.whatsapp}`}
            aria-label="Llamar a Fábrica de Postres"
            className="flex h-10 w-10 items-center justify-center rounded-full text-(--color-ink) transition-colors hover:bg-(--color-cream-dim) lg:hidden"
          >
            <Phone className="h-5 w-5" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </header>
  )
}
