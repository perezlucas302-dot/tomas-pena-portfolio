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
