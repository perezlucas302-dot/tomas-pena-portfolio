import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { PRODUCTS } from './data/products'
import type { Product } from './types'
import { EntryTransition } from './components/shop/EntryTransition'
import { ShopHeader } from './components/shop/ShopHeader'
import { ColorizacionSection } from './components/shop/ColorizacionSection'
import { ShopFooter } from './components/shop/ShopFooter'
import { ProductCard } from './components/shop/ProductCard'
import { CheckoutModal } from './components/shop/CheckoutModal'
import { PaymentReturn } from './components/shop/PaymentReturn'
import { buildDownloadUrl } from './lib/format'

type PaymentReturnState = {
  status: 'success' | 'cancel' | 'pending'
  productTitle?: string
  downloadUrl?: string
} | null

/** Lee ?checkout=... de la URL al volver de Stripe/Mercado Pago y arma lo
 *  que necesita <PaymentReturn />. Limpia la URL después para que un
 *  refresh no vuelva a disparar la descarga. */
function readPaymentReturn(): PaymentReturnState {
  const params = new URLSearchParams(window.location.search)
  const checkout = params.get('checkout')
  if (checkout !== 'success' && checkout !== 'cancel' && checkout !== 'pending') return null

  const productId = params.get('product') ?? undefined
  const product = productId ? PRODUCTS.find((p) => p.id === productId) : undefined

  let downloadUrl: string | undefined
  if (checkout === 'success' && productId) {
    const provider = params.get('provider')
    if (provider === 'stripe' || provider === 'mp') {
      downloadUrl = buildDownloadUrl({
        provider,
        productId,
        sessionId: params.get('session_id'),
        paymentId: params.get('payment_id'),
      })
    }
  }

  window.history.replaceState({}, '', window.location.pathname)

  return { status: checkout, productTitle: product?.title, downloadUrl }
}

export default function App() {
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)
  const [paymentReturn, setPaymentReturn] = useState<PaymentReturnState>(null)
  // Los productos recién se montan cuando termina la entrada — si montaran
  // antes, su animación de scroll-reveal correría (y terminaría) tapada
  // por el overlay de "Shop", y se verían aparecer ya quietos.
  const [introDone, setIntroDone] = useState(false)
  const handleIntroComplete = useCallback(() => setIntroDone(true), [])

  useEffect(() => {
    setPaymentReturn(readPaymentReturn())
  }, [])

  return (
    <div className="min-h-screen bg-bg text-ink">
      <EntryTransition onComplete={handleIntroComplete} />
      <ShopHeader />

      <ColorizacionSection />

      <main className="mx-auto max-w-[1400px] px-[clamp(20px,4vw,64px)] pt-[clamp(24px,4vw,48px)] pb-[clamp(64px,10vw,120px)]">
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

      {paymentReturn && (
        <PaymentReturn
          status={paymentReturn.status}
          productTitle={paymentReturn.productTitle}
          downloadUrl={paymentReturn.downloadUrl}
          onClose={() => setPaymentReturn(null)}
        />
      )}

      <ShopFooter />
    </div>
  )
}
