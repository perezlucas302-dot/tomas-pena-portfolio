export type ProductCategory = 'LUT'

export interface Product {
  id: string
  title: string
  shortDescription: string
  category: ProductCategory
  price: number
  /** Etiqueta estilo "clip de rollo" (convención real de nomenclatura de cámara),
   *  el detalle editorial que reemplaza a un SKU genérico. */
  take: string
  /** Imagen de referencia antes/después del grade. */
  imageBefore: string
  imageAfter: string
  /**
   * Archivo real a entregar al confirmar (ej. un .cube). Si falta, el
   * checkout lo deja claro ("archivo todavía no está listo") en vez de
   * ofrecer una descarga rota.
   */
  downloadUrl?: string
}
