import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { PRODUCTS } from './data/products'
import type { Product } from './types'
import { EntryTransition } from './components/shop/EntryTransition'
import { ShopHeader } from './components/shop/ShopHeader'
import { ColorizacionSection } from './components/shop/ColorizacionSection'
import { ShopFooter } from './components/shop/ShopFooter'
import { ProductCard } from './components/shop/ProductCard'
import { CheckoutModal } from './components/shop/CheckoutModal'

export default function App() {
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)
  // Los productos recién se montan cuando termina la entrada — si montaran
  // antes, su animación de scroll-reveal correría (y terminaría) tapada
  // por el overlay de "Shop", y se verían aparecer ya quietos.
  const [introDone, setIntroDone] = useState(false)
  const handleIntroComplete = useCallback(() => setIntroDone(true), [])

  return (
    <div className="min-h-screen bg-bg text-ink">
      <EntryTransition onComplete={handleIntroComplete} />
      <ShopHeader />

      <ColorizacionSection />

      <main className="mx-auto max-w-[1400px] px-[clamp(20px,4vw,64px)] py-[clamp(64px,10vw,120px)]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {introDone &&
              PRODUCTS.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} onAdd={setCheckoutProduct} />
              ))}
          </AnimatePresence>
        </div>
      </main>

      <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
      <ShopFooter />
    </div>
  )
}
