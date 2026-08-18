import { useCallback, useRef, useState } from 'react'

interface BeforeAfterSliderProps {
  /** Si todavía no hay still crudo subido, se muestra un placeholder en vez de romper con un <img> vacío. */
  before?: string
  after: string
  title: string
}

/**
 * Slider antes/después arrastrable. La imagen "after" queda recortada con
 * clip-path según la posición del handle; todo controlado con pointer
 * events para que funcione igual con mouse y con dedo.
 */
export function BeforeAfterSlider({ before, after, title }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)

  const updateFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true)
    updateFromClientX(e.clientX)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    updateFromClientX(e.clientX)
  }

  const onPointerUp = () => setDragging(false)

  return (
    <div
      ref={frameRef}
      className="group/frame relative aspect-video w-full touch-none overflow-hidden bg-bg-elevated select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Base: RAW */}
      {before ? (
        <img
          src={before}
          alt={`${title} — antes del grade`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-elevated">
          <span className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">Raw — próximamente</span>
        </div>
      )}

      {/* Overlay: GRADED, recortado por el handle */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={after}
          alt={`${title} — después del grade`}
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Etiquetas RAW / GRADED — el overlay GRADED queda recortado a la
          izquierda del handle (inset ... 0 0 con position creciendo hacia
          la derecha), así que el RAW de base asoma a la derecha. Las
          etiquetas van en ese mismo orden, si no quedan cruzadas. */}
      <span className="pointer-events-none absolute top-3 left-3 font-mono text-[10px] tracking-[0.12em] text-ink-muted uppercase">
        Graded
      </span>
      <span className="pointer-events-none absolute top-3 right-3 font-mono text-[10px] tracking-[0.12em] text-ink-muted uppercase">
        Raw
      </span>

      {/* Línea + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-ink/70"
        style={{ left: `${position}%` }}
      >
        <div
          className={`absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/40 bg-bg/90 backdrop-blur-sm transition-transform duration-300 ease-site ${
            dragging ? 'scale-110' : 'group-hover/frame:scale-105'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink">
            <path d="M8 6L2 12L8 18" />
            <path d="M16 6L22 12L16 18" />
          </svg>
        </div>
      </div>
    </div>
  )
}
