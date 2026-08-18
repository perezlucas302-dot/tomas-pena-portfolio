import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE, ENTRY_DURATION } from '../../lib/motion'

interface EntryTransitionProps {
  /** Se llama cuando la secuencia termina (o de inmediato si hay reduced-motion). */
  onComplete?: () => void
}

/**
 * "Scale Brutal" — la palabra SHOP explota hacia el usuario y se
 * desvanece revelando la Shop real detrás (que ya está montada debajo,
 * este overlay solo la tapa mientras dura la secuencia). Sin librerías
 * nuevas: usa Framer Motion, que ya está instalado.
 *
 * Se dispara una vez por cada carga real de la página (esta es una app
 * separada del sitio principal — cada vez que se navega a /proyectos/shop
 * el documento se carga de cero, así que no hace falta lógica extra para
 * "repetir la intro"; ya se repite sola en cada entrada real).
 */
export function EntryTransition({ onComplete }: EntryTransitionProps) {
  const reduceMotion = useReducedMotion()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setDone(true)
      onComplete?.()
      return
    }
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => {
      setDone(true)
      document.body.style.overflow = ''
      onComplete?.()
    }, ENTRY_DURATION * 1000)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [reduceMotion, onComplete])

  if (done) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: ENTRY_DURATION, times: [0, 0.72, 1], ease: EASE }}
      >
        <motion.span
          className="font-display font-extrabold text-ink uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(64px, 16vw, 220px)' }}
          initial={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          animate={{ scale: [1, 1.9, 3.4], opacity: [1, 0.85, 0], filter: ['blur(0px)', 'blur(1px)', 'blur(3px)'] }}
          transition={{ duration: ENTRY_DURATION, times: [0, 0.25, 1], ease: EASE }}
        >
          Shop
        </motion.span>
      </motion.div>
    </AnimatePresence>
  )
}
