import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Catalog } from './components/Catalog'
import { AboutSection } from './components/AboutSection'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog />
        <AboutSection />
        <Contact />
      </main>
      <Footer />

      <CartDrawer />
    </>
  )
}

export default App
