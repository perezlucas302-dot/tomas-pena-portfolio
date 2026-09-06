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
 * URL de /api/download para un producto pago ya aprobado por Mercado
 * Pago, a partir de los parámetros que devuelve en su redirect de éxito.
 * La arma PaymentReturn.tsx después de leer la URL de vuelta del pago.
 * (Solo aplica si MP se reactiva — el producto que se vende hoy se compra
 * en Gumroad, que entrega el archivo directo, sin pasar por acá.)
 */
export function buildDownloadUrl(params: { productId: string; paymentId?: string | null }): string {
  const qs = new URLSearchParams({ provider: 'mp', product: params.productId })
  if (params.paymentId) qs.set('payment_id', params.paymentId)
  return `/api/download?${qs.toString()}`
}
