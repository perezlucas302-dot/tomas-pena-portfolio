/** "Gratis" para el LUT de prueba (price 0), "$N" para el resto — un solo lugar para este criterio. */
export function formatPrice(price: number): string {
  return price === 0 ? 'Gratis' : `$${price}`
}

/**
 * Nombre sugerido al guardar el archivo descargado: el título del producto,
 * no el nombre técnico del archivo en el repo — así el usuario ve
 * "Origen LUT — Tomas Peña.drx" en su carpeta de Descargas, no "origen-lut.drx".
 * Si la URL no tiene extensión reconocible, no fuerza ningún nombre.
 */
export function downloadFilename(title: string, downloadUrl: string): string | undefined {
  const extension = downloadUrl.split('.').pop()
  if (!extension || extension === downloadUrl) return undefined
  return `${title}.${extension}`
}

/**
 * URL de /api/download para un producto pago ya aprobado, a partir de los
 * parámetros que devuelve cada proveedor en su redirect de éxito. La arma
 * PaymentReturn.tsx después de leer la URL de vuelta del pago.
 */
export function buildDownloadUrl(params: {
  provider: 'stripe' | 'mp'
  productId: string
  sessionId?: string | null
  paymentId?: string | null
}): string {
  const qs = new URLSearchParams({ provider: params.provider, product: params.productId })
  if (params.sessionId) qs.set('session_id', params.sessionId)
  if (params.paymentId) qs.set('payment_id', params.paymentId)
  return `/api/download?${qs.toString()}`
}
