import { useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { FeaturedMenu } from './components/FeaturedMenu'
import { Story } from './components/Story'
import { Gallery } from './components/Gallery'
import { Reviews } from './components/Reviews'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { MenuOverlay } from './components/MenuOverlay'
import { CartDrawer } from './components/CartDrawer'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <main>
        <Hero onOpenMenu={() => setMenuOpen(true)} />
        <FeaturedMenu onOpenMenu={() => setMenuOpen(true)} />
        <Story />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />

      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      <CartDrawer />
    </>
  )
}

export default App
