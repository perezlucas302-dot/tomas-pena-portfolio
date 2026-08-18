export interface CaseStudy {
  /** Coincide con el slug de proyectos/<slug>.html en el sitio principal. */
  slug: string
  title: string
  context: string
  /**
   * Frame crudo (sin grade). Mientras falte, BeforeAfterSlider cae a un
   * placeholder en vez de romper con una imagen inexistente.
   */
  before?: string
  /** El grade final tal cual salió al aire. */
  after: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'fernet-branca',
    title: 'Fernet Branca',
    context: 'Cosquín Rock 2026 — grade cálido de alto contraste para cobertura en vivo.',
    before: '/assets/img/covers/fernet-before.jpg',
    after: '/assets/img/covers/fernet-after.jpg',
  },
  {
    slug: 'heredero-gin',
    title: 'Heredero Gin',
    context: 'Heredero 0.0 Nuevo Gin — tonos ámbar, producto como protagonista.',
    before: '/assets/img/covers/heredero-before.jpg',
    after: '/assets/img/covers/heredero-after.jpg',
  },
  {
    slug: 'luzu-vlog',
    title: 'Luzu',
    context: 'Travel vlog — grade natural, tonos cálidos sin perder piel.',
    before: '/assets/img/covers/luzu-before.jpg',
    after: '/assets/img/covers/luzu-after.jpg',
  },
]
