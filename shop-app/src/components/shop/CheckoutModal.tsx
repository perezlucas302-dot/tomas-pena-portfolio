import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Product } from '../../types'
import { downloadFilename, formatPrice } from '../../lib/format'

interface CheckoutModalProps {
  product: Product | null
  onClose: () => void
}

type Provider = 'mp'

// Mercado Pago sigue implementado (backend y lógica intactos) pero el botón
// queda oculto hasta decidir con el cliente si se usa. Poner en `true` para
// volver a mostrarlo — no hace falta tocar nada más.
const SHOW_MERCADOPAGO = false

export function CheckoutModal({ product, onClose }: CheckoutModalProps) {
  const [loading, setLoading] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function pay(provider: Provider) {
    if (!product) return
    setError(null)
    setLoading(provider)
    try {
      const res = await fetch('/api/create-mp-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
      if (!res.ok) throw new Error()
      const data: { url?: string } = await res.json()
      if (!data.url) throw new Error()
      window.location.href = data.url
    } catch {
      setError('No se pudo iniciar el pago. Probá de nuevo en un rato.')
      setLoading(null)
    }
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Checkout — ${product.title}`}
            className="w-full max-w-sm rounded-[18px] border border-line bg-bg-elevated p-6"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="eyebrow flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-ink-muted uppercase">
                <span className="rec-dot" /> Resumen de compra
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="text-ink-muted transition-colors duration-300 ease-site hover:text-ink"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-5 flex items-start justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
                  {product.category} · {product.take}
                </p>
                <h3 className="font-display text-xl leading-tight font-extrabold tracking-tight text-ink uppercase">
                  {product.title}
                </h3>
              </div>
              <span className="font-mono text-sm text-ink shrink-0">{formatPrice(product.price)}</span>
            </div>

            <div className="mb-6 flex items-center justify-between font-mono text-[13px] tracking-[0.04em] text-ink uppercase">
              <span className="text-ink-muted">Total</span>
              <span>{product.price === 0 ? 'Gratis' : `${formatPrice(product.price)} USD`}</span>
            </div>

            {product.price === 0 ? (
              product.downloadUrl ? (
                <a
                  href={product.downloadUrl}
                  download={downloadFilename(product.title, product.downloadUrl)}
                  className="block w-full rounded-full bg-ink px-5 py-3 text-center font-mono text-[12px] font-medium tracking-[0.08em] text-bg uppercase transition-opacity duration-300 ease-site hover:opacity-85"
                >
                  Descargar ahora
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-full bg-ink px-5 py-3 font-mono text-[12px] font-medium tracking-[0.08em] text-bg uppercase opacity-40"
                >
                  Descargar ahora
                </button>
              )
            ) : (
              <div className="flex flex-col gap-3">
                {product.gumroadUrl && (
                  <a
                    href={product.gumroadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-full bg-ink px-5 py-3 text-center font-mono text-[12px] font-medium tracking-[0.08em] text-bg uppercase transition-opacity duration-300 ease-site hover:opacity-85"
                  >
                    Comprar en Gumroad
                  </a>
                )}
                {SHOW_MERCADOPAGO && (
                  <button
                    type="button"
                    disabled={loading !== null}
                    onClick={() => pay('mp')}
                    className="w-full rounded-full border border-ink-faint px-5 py-3 font-mono text-[12px] font-medium tracking-[0.08em] text-ink uppercase transition-colors duration-300 ease-site hover:border-rec hover:text-rec disabled:cursor-wait disabled:opacity-60"
                  >
                    {loading === 'mp' ? 'Redirigiendo…' : 'Pagar con Mercado Pago'}
                  </button>
                )}
                {!product.gumroadUrl && !SHOW_MERCADOPAGO && (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-full bg-ink px-5 py-3 font-mono text-[12px] font-medium tracking-[0.08em] text-bg uppercase opacity-40"
                  >
                    Todavía no está a la venta
                  </button>
                )}
              </div>
            )}

            {error && <p className="mt-3 text-center font-mono text-[10px] text-rec uppercase">{error}</p>}

            <p className="mt-4 text-center font-mono text-[10px] text-ink-faint uppercase">
              {product.price === 0
                ? product.downloadUrl
                  ? 'Descarga directa — sin registro'
                  : 'Todavía no está listo para descargar'
                : product.gumroadUrl
                  ? 'Se abre en Gumroad — el archivo llega ahí y por mail'
                  : 'Pago seguro — el LUT se descarga solo al aprobarse'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
