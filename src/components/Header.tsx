import { useEffect, useState } from 'react'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { asset } from '../utils/asset'

const NAV_LINKS = [
  { label: 'Menú', href: '#menu' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { itemCount, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visible = scrolled || mobileOpen

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-(--color-cream)/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" className="flex items-center">
          <img
            src={asset('/images/logo/logo.png')}
            alt="Fábrica de Postres · Eventos y Pastelería"
            className="h-11 w-auto lg:h-12"
          />
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-(--color-ink-soft) transition-colors hover:text-(--color-wine)"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-(--color-ink) transition-colors hover:bg-(--color-cream-dim)"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-wine) text-[10px] font-medium text-(--color-cream)">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir navegación"
            className="flex h-10 w-10 items-center justify-center rounded-full text-(--color-ink) lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="min-h-dvh border-t border-(--color-line) bg-(--color-cream) px-6 py-8 lg:hidden">
          <nav className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-xl text-(--color-ink)"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
