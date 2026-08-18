import { motion } from 'framer-motion'
import { CASE_STUDIES } from '../../data/caseStudies'
import { CaseStudyCard } from './CaseStudyCard'

/**
 * "Martillo": el título cae desde arriba, golpea (squash + flash) y se
 * queda quieto — sin rebote. Los dos elementos (palabra + marca roja)
 * comparten un mismo trigger de scroll vía variants, para que el golpe
 * y la marca lleguen sincronizados. Curva de impacto propia, más brusca
 * que --ease-site a propósito — acá no se busca prolijo, se busca seco.
 */
const HAMMER_EASE = [0.5, 0, 1, 0.4] as const

const titleVariants = {
  hidden: { y: -160, opacity: 0.85, scaleX: 1, scaleY: 1, filter: 'blur(0px)' },
  visible: {
    y: [-160, -30, 0, 0],
    scaleY: [1, 1.15, 0.8, 1],
    scaleX: [1, 1, 1.08, 1],
    filter: ['blur(0px)', 'blur(1.5px)', 'blur(0px)', 'blur(0px)'],
    opacity: [0.85, 1, 1, 1],
    transition: { duration: 0.55, times: [0, 0.45, 0.85, 1], ease: HAMMER_EASE },
  },
}

const markVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { delay: 0.47, duration: 0.15, ease: 'easeOut' as const } },
}

/**
 * Salpicón justo cuando el martillo pega — mezcla de gotas irregulares
 * (blob, no círculos perfectos) y chorretes finos rotados (streak, como
 * pintura que salió disparada de la brocha), mayormente blancas con un
 * par de motas rojas al final, como si algo de rec-red se hubiera
 * mezclado en la salpicadura. Cada una con su propio delay — no
 * sincronizadas en bloque, se sienten disparadas por el impacto.
 */
const BLOB_RADII = [
  '58% 42% 63% 37% / 41% 55% 45% 59%',
  '46% 54% 38% 62% / 55% 42% 58% 45%',
  '62% 38% 55% 45% / 48% 60% 40% 52%',
]

interface SplashDrop {
  x: number
  y: number
  delay: number
  color: string
  shape: 'blob' | 'streak'
  size?: number
  radius?: number
  length?: number
  thickness?: number
  rotate?: number
}

const SPLASH_DROPS: SplashDrop[] = [
  // Gotas — blanco
  { shape: 'blob', x: -64, y: 8, size: 8, delay: 0.47, radius: 0, color: 'var(--color-ink)' },
  { shape: 'blob', x: -42, y: -11, size: 5, delay: 0.5, radius: 1, color: 'var(--color-ink)' },
  { shape: 'blob', x: -18, y: 15, size: 10, delay: 0.46, radius: 2, color: 'var(--color-ink)' },
  { shape: 'blob', x: 6, y: -9, size: 6, delay: 0.52, radius: 0, color: 'var(--color-ink)' },
  { shape: 'blob', x: 28, y: 12, size: 7, delay: 0.49, radius: 1, color: 'var(--color-ink)' },
  { shape: 'blob', x: 52, y: -5, size: 9, delay: 0.48, radius: 2, color: 'var(--color-ink)' },
  { shape: 'blob', x: 72, y: 9, size: 5, delay: 0.54, radius: 0, color: 'var(--color-ink)' },
  { shape: 'blob', x: -8, y: 24, size: 4, delay: 0.56, radius: 1, color: 'var(--color-ink)' },
  // Chorretes — pintura "flicked" fuera del golpe
  { shape: 'streak', x: -88, y: 2, length: 16, thickness: 2.5, rotate: -25, delay: 0.5, color: 'var(--color-ink)' },
  { shape: 'streak', x: 86, y: -6, length: 14, thickness: 2, rotate: 20, delay: 0.51, color: 'var(--color-ink)' },
  { shape: 'streak', x: -46, y: -24, length: 12, thickness: 2, rotate: -60, delay: 0.53, color: 'var(--color-ink)' },
  { shape: 'streak', x: 38, y: -22, length: 13, thickness: 2, rotate: 55, delay: 0.52, color: 'var(--color-ink)' },
  { shape: 'streak', x: 0, y: 30, length: 11, thickness: 2, rotate: 5, delay: 0.57, color: 'var(--color-ink)' },
  // Motas rojas — las últimas en "caer"
  { shape: 'blob', x: -24, y: 5, size: 4, delay: 0.58, radius: 2, color: 'var(--color-rec)' },
  { shape: 'blob', x: 34, y: 2, size: 3.5, delay: 0.6, radius: 0, color: 'var(--color-rec)' },
]

function dropVariants(delay: number) {
  return {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.3, 1],
      opacity: [0, 1, 0.85],
      transition: { delay, duration: 0.35, ease: 'easeOut' as const },
    },
  }
}

export function ColorizacionSection() {
  return (
    <section className="border-t border-line py-[clamp(80px,12vw,160px)]">
      <div className="mx-auto max-w-[1400px] px-[clamp(20px,4vw,64px)]">
        <motion.div
          className="flex flex-col items-center gap-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          <span className="eyebrow flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-ink-muted uppercase">
            <span className="rec-dot" />
            Probado en marcas reales
          </span>

          <div className="relative">
            <motion.h2
              variants={titleVariants}
              className="font-display text-[clamp(40px,7vw,88px)] leading-[0.92] font-extrabold tracking-tight text-ink uppercase"
            >
              Colorización
            </motion.h2>
            {SPLASH_DROPS.map((drop, i) =>
              drop.shape === 'blob' ? (
                // Wrapper quieto (posiciona y centra) + motion.span adentro que
                // solo anima scale/opacity — si el transform de posición fuera
                // en el mismo nodo que anima Framer, Framer lo pisa.
                <span
                  key={i}
                  className="pointer-events-none absolute"
                  style={{
                    left: `calc(50% + ${drop.x}px)`,
                    top: `calc(100% + ${drop.y}px)`,
                    width: drop.size,
                    height: drop.size,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <motion.span
                    variants={dropVariants(drop.delay)}
                    className="block h-full w-full blur-[0.4px]"
                    style={{ background: drop.color, borderRadius: BLOB_RADII[drop.radius ?? 0] }}
                  />
                </span>
              ) : (
                <span
                  key={i}
                  className="pointer-events-none absolute"
                  style={{
                    left: `calc(50% + ${drop.x}px)`,
                    top: `calc(100% + ${drop.y}px)`,
                    width: drop.length,
                    height: drop.thickness,
                    // El translate centra el chorrete en (x, y) antes de rotarlo,
                    // así el giro pivotea sobre su propio centro.
                    transform: `translate(-50%, -50%) rotate(${drop.rotate}deg)`,
                  }}
                >
                  <motion.span
                    variants={dropVariants(drop.delay)}
                    className="block h-full w-full rounded-full blur-[0.4px]"
                    style={{ background: drop.color }}
                  />
                </span>
              ),
            )}
          </div>

          <motion.span variants={markVariants} className="mt-2 h-[2px] w-24 origin-center bg-rec" />

          <p className="max-w-md text-sm leading-relaxed text-ink-muted">
            El mismo grade que ya vive en marcas reales — no es una demo, es lo que salió al aire.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map((caseStudy, index) => (
            <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} index={index} />
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-2.5 border-t border-line pt-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-faint">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span className="font-mono text-[11px] tracking-[0.08em] text-ink-faint uppercase">
            Estos LUTs siguen acá abajo, a la venta
          </span>
        </div>
      </div>
    </section>
  )
}
