import type { Product } from '../types'

/**
 * Catálogo visual de LUTs — lo que se ve en la shop (título, fotos,
 * descripción, precio a mostrar). Para los productos PAGOS, el precio
 * que se cobra de verdad y el archivo a entregar viven en
 * `api/_lib/catalog.js` (raíz del repo) y en Vercel Blob respectivamente
 * — nunca acá, porque este archivo es público en GitHub. Si cambiás el
 * precio de un producto pago, actualizalo en los dos lugares.
 *
 * "Origen LUT" ya tiene sus imágenes y su descarga real (gratis, sin
 * pago). "Ruptura LUT" ya tiene todo cargado — imágenes, descripción y
 * archivo subido a Vercel Blob (ver PAGOS-SETUP.md).
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
    // Pago — el precio real a cobrar está en api/_lib/catalog.js
    // (PRODUCTS['lut-ruptura'].priceUsdCents). Mantené este
    // `price: 29.99` igual a ese valor, es solo para mostrarlo en la card.
    id: 'lut-ruptura',
    title: 'Ruptura LUT — Tomas Peña',
    shortDescription:
      'LOOK CÁLIDO, CINEMATOGRÁFICO Y CON CONTRASTE, RESALTANDO TONOS DE PIEL Y CREANDO UNA ATMÓSFERA MÁS INTENSA Y PROFESIONAL.',
    category: 'LUT',
    price: 29.99,
    take: 'Etapa 02',
    imageBefore: '/assets/img/covers/ruptura-lut-before.jpg',
    imageAfter: '/assets/img/covers/ruptura-lut-after.jpg',
    // Sin downloadUrl a propósito: es un producto pago, se compra en
    // Gumroad (ver gumroadUrl) — Gumroad entrega el archivo, no nosotros.
    gumroadUrl: 'https://tomypena.gumroad.com/l/ruptura',
  },
]
