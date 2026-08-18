import { useEffect, useState } from 'react'

export function ShopFooter() {
  const [clock, setClock] = useState('--:--:--')

  // Reloj en vivo — misma zona horaria que usa el resto del sitio
  useEffect(() => {
    const update = () => {
      setClock(
        new Intl.DateTimeFormat('es-AR', {
          timeZone: 'America/Argentina/Cordoba',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date()),
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-[clamp(20px,4vw,64px)] py-[clamp(56px,9vw,96px)]">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-line pb-8">
          <span className="font-display text-[clamp(32px,5.5vw,60px)] leading-none font-extrabold tracking-tight text-ink uppercase">
            Tomas Peña
          </span>
          <img
            src="/assets/img/personal/firma-tomas-pena.png"
            alt="Firma de Tomas Peña"
            className="h-9 w-auto md:h-11"
          />
        </div>

        <div className="mt-6 flex flex-col gap-1 font-mono text-[clamp(13px,1.6vw,16px)] tracking-[0.06em] uppercase">
          <span className="text-ink-muted">Editor audiovisual</span>
          <strong className="font-bold text-ink">Created in Argentina</strong>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3">
          <nav className="flex flex-col gap-3" aria-label="Secciones del home">
            <h4 className="mb-1 font-mono text-[11px] tracking-[0.12em] text-ink-faint uppercase">Home</h4>
            <a href="/#proyectos" className="font-mono text-[13px] text-ink-muted uppercase transition-colors duration-300 ease-site hover:text-ink">Proyectos</a>
            <a href="/#servicios" className="font-mono text-[13px] text-ink-muted uppercase transition-colors duration-300 ease-site hover:text-ink">Servicios</a>
            <a href="/#sobre-mi" className="font-mono text-[13px] text-ink-muted uppercase transition-colors duration-300 ease-site hover:text-ink">Sobre mí</a>
            <a href="/#contacto" className="font-mono text-[13px] text-ink-muted uppercase transition-colors duration-300 ease-site hover:text-ink">Contacto</a>
          </nav>

          <nav className="flex flex-col gap-3" aria-label="Social">
            <h4 className="mb-1 font-mono text-[11px] tracking-[0.12em] text-ink-faint uppercase">Social</h4>
            <a href="mailto:tomaslautaropena@gmail.com" className="font-mono text-[13px] text-ink-muted uppercase transition-colors duration-300 ease-site hover:text-ink">Email</a>
            <a href="https://instagram.com/tomyypena10" target="_blank" rel="noopener" className="font-mono text-[13px] text-ink-muted uppercase transition-colors duration-300 ease-site hover:text-ink">Instagram</a>
          </nav>

          <nav className="flex flex-col gap-3" aria-label="Legal">
            <h4 className="mb-1 font-mono text-[11px] tracking-[0.12em] text-ink-faint uppercase">Legal</h4>
            <a href="#" className="font-mono text-[13px] text-ink-muted uppercase transition-colors duration-300 ease-site hover:text-ink">Términos y condiciones</a>
            <a href="#" className="font-mono text-[13px] text-ink-muted uppercase transition-colors duration-300 ease-site hover:text-ink">Política de privacidad</a>
          </nav>
        </div>

        <a href="/#contacto"
          className="group/hablemos mt-12 flex items-center justify-between border-y border-line py-6 transition-colors duration-300 ease-site hover:border-rec"
            >
          <span className="bg-gradient-to-r from-ink to-rec bg-clip-text font-display text-[clamp(28px,4.5vw,48px)] leading-none font-extrabold tracking-tight text-transparent uppercase">
            Hablemos
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 text-ink-muted transition-transform duration-300 ease-site group-hover/hablemos:translate-x-1 group-hover/hablemos:text-rec"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-xs tracking-[0.06em] text-ink-faint uppercase">
          <span>© {new Date().getFullYear()} Tomas Peña</span>
          <span className="flex items-center gap-2">
            <span className="rec-dot" /> Paraná, AR — {clock}
          </span>
        </div>
    </footer>
  )
}