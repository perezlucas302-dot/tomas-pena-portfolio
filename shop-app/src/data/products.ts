import type { Product } from '../types'

/**
 * Catálogo de LUTs. "Origen LUT" ya tiene sus imágenes y su descarga real
 * — "Blue Hour Noir" sigue con placeholders de placehold.co, reemplazar
 * por capturas antes/después reales cuando estén los activos definitivos.
 */
export const PRODUCTS: Product[] = [
  {
    // Primer LUT del catálogo = gratis, de prueba (ProductCard/CheckoutModal
    // cambian su copy y su botón automáticamente cuando price es 0).
    id: 'lut-origen',
    title: 'Origen LUT — Tomas Peña',
    shortDescription: 'POWERGRADED + LUT, HECHO PARA QUE TUS VIDEOS SE VEAN CINEMATOGRAFICOS CON UN SOLO CLICK.',
    category: 'LUT',
    price: 0,
    take: 'Etapa 01',
    imageBefore: '/assets/img/covers/origen-lut-before.jpg',
    imageAfter: '/assets/img/covers/origen-lut-after.jpg',
    downloadUrl: '/assets/luts/origen-lut.drx',
  },
  {
    id: 'lut-blue-hour-noir',
    title: 'Blue Hour Noir',
    shortDescription: 'Sombras azuladas y contraste alto para escenas nocturnas.',
    category: 'LUT',
    price: 15,
    take: 'B012_C003',
    imageBefore: 'https://placehold.co/1200x800/1a1a18/514c43?text=RAW',
    imageAfter: 'https://placehold.co/1200x800/0d1520/6f9bd1?text=GRADED',
  },
]
