import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { CaseStudy } from '../../data/caseStudies'
import { EASE } from '../../lib/motion'
import { BeforeAfterSlider } from './BeforeAfterSlider'

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  /** Posición en la fila — mismo patrón de stagger que ProductCard. */
  index: number
}

export function CaseStudyCard({ caseStudy, index }: CaseStudyCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  // Pincelada bajo el título: se "dibuja" a medida que la card sube por
  // la pantalla (no es un trigger único como el resto de los reveals acá).
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start 0.85', 'start 0.4'] })
  const paintProgress = useTransform(scrollYProgress, [0, 1], [0, 1])
  // Mota roja que "salpica" recién al final del trazo, cuando la pincelada blanca ya casi terminó.
  const fleckRadius = useTransform(paintProgress, [0.85, 1], [0, 2.6])
  const fleckOpacity = useTransform(paintProgress, [0.85, 1], [0, 1])

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: EASE }}
      className="flex flex-col border border-line bg-bg-elevated/40"
    >
      <BeforeAfterSlider before={caseStudy.before} after={caseStudy.after} title={caseStudy.title} />

      <div className="flex flex-col gap-1.5 p-5">
        <span className="font-mono text-[10px] tracking-[0.1em] text-rec uppercase">Caso real</span>

        <div className="relative mb-1.5 inline-block w-fit">
          <h3 className="font-display text-xl leading-none font-extrabold tracking-tight text-ink uppercase">
            {caseStudy.title}
          </h3>
          <svg
            className="pointer-events-none absolute -bottom-3 left-0 h-3 w-full overflow-visible"
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Segunda pasada, más tenue y con otra curva — da textura de
                pincel real (dos trazos que no calzan perfecto) en vez de
                una línea sola y prolija. Va detrás de la principal. */}
            <motion.path
              d="M3 8.5 Q 26 4.5 49 8.5 T 97 7.5"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity={0.3}
              style={{ pathLength: paintProgress }}
            />
            <motion.path
              d="M2 7 Q 25 2 50 7 T 98 6"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength: paintProgress }}
            />
            {/* Mota roja al final del trazo — el mismo guiño de color que ya
                salpica el título de arriba. */}
            <motion.circle cx={98} cy={6} r={fleckRadius} fill="var(--color-rec)" style={{ opacity: fleckOpacity }} />
          </svg>
        </div>

        <p className="text-xs leading-relaxed text-ink-muted">{caseStudy.context}</p>
        <a
          href={`/proyectos/${caseStudy.slug}.html`}
          className="mt-1 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-ink-muted uppercase transition-colors duration-300 ease-site hover:text-ink"
        >
          Ver proyecto
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </motion.article>
  )
}
