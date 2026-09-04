import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

type Status = 'success' | 'cancel' | 'pending'

interface PaymentReturnProps {
  status: Status
  productTitle?: string
  downloadUrl?: string
  onClose: () => void
}

const COPY: Record<Status, { eyebrow: string; title: string; body: (productTitle?: string) => string }> = {
  success: {
    eyebrow: 'Pago aprobado',
    title: '¡Gracias por tu compra!',
    body: (productTitle) =>
      productTitle
        ? `Tu descarga de "${productTitle}" empezó sola. Si no pasó nada, usá el botón de abajo.`
        : 'Tu descarga empezó sola. Si no pasó nada, usá el botón de abajo.',
  },
  pending: {
    eyebrow: 'Pago en proceso',
    title: 'Pago pendiente',
    body: () =>
      'Tu pago todavía se está procesando. En cuanto se apruebe vas a poder descargar el LUT — probá volver a esta página en un rato.',
  },
  cancel: {
    eyebrow: 'Pago cancelado',
    title: 'No se completó el pago',
    body: () => 'No se hizo ningún cobro. Podés intentar de nuevo cuando quieras.',
  },
}

/**
 * Pantalla que se muestra al volver de Stripe/Mercado Pago (?checkout=...
 * en la URL, ver App.tsx). Si el pago está aprobado y hay downloadUrl,
 * dispara la descarga sola apenas se monta — el botón "Volver a
 * descargar" queda de respaldo por si el navegador bloqueó la descarga
 * automática.
 */
export function PaymentReturn({ status, productTitle, downloadUrl, onClose }: PaymentReturnProps) {
  const triggered = useRef(false)

  useEffect(() => {
    if (status === 'success' && downloadUrl && !triggered.current) {
      triggered.current = true
      window.location.href = downloadUrl
    }
  }, [status, downloadUrl])

  const copy = COPY[status]

  return (
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
        aria-label={copy.title}
        className="w-full max-w-sm rounded-[18px] border border-line bg-bg-elevated p-6 text-center"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="eyebrow mb-4 flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.12em] text-ink-muted uppercase">
          <span className="rec-dot" /> {copy.eyebrow}
        </span>

        <h3 className="mb-3 font-display text-xl leading-tight font-extrabold tracking-tight text-ink uppercase">
          {copy.title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-ink-muted">{copy.body(productTitle)}</p>

        {status === 'success' && downloadUrl && (
          <a
            href={downloadUrl}
            className="mb-3 block w-full rounded-full bg-ink px-5 py-3 text-center font-mono text-[12px] font-medium tracking-[0.08em] text-bg uppercase transition-opacity duration-300 ease-site hover:opacity-85"
          >
            Volver a descargar
          </a>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full border border-ink-faint px-5 py-3 font-mono text-[12px] font-medium tracking-[0.08em] text-ink uppercase transition-colors duration-300 ease-site hover:border-rec hover:text-rec"
        >
          Cerrar
        </button>
      </motion.div>
    </motion.div>
  )
}
