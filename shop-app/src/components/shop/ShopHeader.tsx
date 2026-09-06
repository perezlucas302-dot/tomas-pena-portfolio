/**
 * Hero de la Shop — hermano del hero del home (foto + scrim + nombre
 * gigante) pero con video de fondo en vez de una sola foto. El clip vive
 * en /assets/video/shop/ del sitio principal (mismo mecanismo que sirve
 * /assets/video/hover/ para los previews del home — ver
 * shop-app/vite-plugins/serve-site-assets.ts).
 *
 * Mientras el clip no esté subido a esa carpeta, cae al degradé de fondo
 * (no se rompe ni queda un video negro).
 */
const CLIP = {
  src: '/assets/video/shop/b-roll-timeline.mp4',
  gradient: 'linear-gradient(135deg,#151313 0%,#221e1a 45%,#121110 100%)',
}

export function ShopHeader() {
  return (
    <div className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-bg">
      <div className="absolute inset-0" style={{ background: CLIP.gradient }}>
        {/* En mobile el recorte de object-cover queda muy angosto (la
            persona del clip está corrida a la izquierda del cuadro) y con
            el centrado por default se le va todo ese lado; se corre el
            punto de recorte hacia la izquierda solo ahí. En desktop el
            cuadro es más ancho y el centrado ya se ve bien. */}
        <video
          className="absolute inset-0 h-full w-full object-cover object-[20%_center] md:object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={CLIP.src} type="video/mp4" />
        </video>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 54%, rgba(11,11,10,.88) 0%, rgba(11,11,10,.6) 45%, rgba(11,11,10,.22) 75%, rgba(11,11,10,.05) 100%)',
        }}
      />

      <div className="absolute top-8 right-6 flex items-center gap-2.5 border border-line bg-bg/55 px-3.5 py-2 sm:top-10 sm:right-14">
        <span className="rec-dot" />
        <span className="font-mono text-[10px] tracking-[0.1em] text-ink uppercase sm:text-[11px]">Descarga inmediata</span>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center">
        <h1
          className="font-display font-extrabold text-ink uppercase leading-[0.88] tracking-tight"
          style={{ fontSize: 'clamp(56px, 11vw, 128px)', textShadow: '0 10px 60px rgba(0,0,0,.65)' }}
        >
          Grade &<br />Grain
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-ink-muted">
          LUTs de color probados en producción, listos para bajar directo al timeline.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="relative h-6 w-px bg-ink-faint">
          <span className="scroll-cue-dot" />
        </span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">Scroll</span>
      </div>
    </div>
  )
}
