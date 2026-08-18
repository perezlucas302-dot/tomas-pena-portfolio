import { motion } from 'framer-motion'
import type { Product } from '../../types'
import { EASE } from '../../lib/motion'
import { formatPrice } from '../../lib/format'
import { BeforeAfterSlider } from './BeforeAfterSlider'

interface ProductCardProps {
  product: Product
  /** Posición en el grid — decide el delay del stagger al entrar en scroll. */
  index: number
  onAdd: (product: Product) => void
}

export function ProductCard({ product, index, onAdd }: ProductCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: EASE }}
      className="flex flex-col border border-line bg-bg-elevated/40 backdrop-blur-sm"
    >
      <BeforeAfterSlider before={product.imageBefore} after={product.imageAfter} title={product.title} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-[0.1em] text-ink-muted uppercase">
            {product.category} · {product.take}
          </span>
          <span className={`font-mono text-[11px] ${product.price === 0 ? 'font-medium text-rec' : 'text-ink-faint'}`}>
            {formatPrice(product.price)}
          </span>
        </div>

        <h3 className="font-display text-2xl leading-none font-extrabold tracking-tight text-ink uppercase">
          {product.title}
        </h3>

        <p className="flex-1 text-sm leading-relaxed text-ink-muted">{product.shortDescription}</p>

        <button
          type="button"
          onClick={() => onAdd(product)}
          className="group/btn mt-1 flex items-center justify-between border border-ink-faint px-4 py-2.5 font-mono text-[12px] tracking-[0.08em] text-ink uppercase transition-colors duration-300 ease-site hover:border-rec hover:text-rec"
        >
          {product.price === 0 ? 'Descargar gratis' : `Añadir · ${formatPrice(product.price)}`}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform duration-300 ease-site group-hover/btn:translate-x-1"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </motion.article>
  )
}
