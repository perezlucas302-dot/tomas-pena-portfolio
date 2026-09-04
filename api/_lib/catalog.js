/**
 * Catálogo "de servidor": la fuente de verdad para precio y monto a cobrar
 * en Stripe / Mercado Pago. A propósito es un archivo aparte del catálogo
 * visual (`shop-app/src/data/products.ts`) — ese decide qué se ve en la
 * shop (título, fotos, descripción), este decide cuánto se cobra de
 * verdad. Mantenerlos sincronizados a mano: cuando sumes o cambies el
 * precio de un producto pago en `products.ts`, actualizá también acá.
 *
 * El LUT gratis (`lut-origen`, price 0) no necesita entrada acá — nunca
 * pasa por pago, se descarga directo desde /assets/luts/.
 */

export const PRODUCTS = {
  'lut-ruptura': {
    title: 'Ruptura LUT — Tomas Peña',
    priceUsdCents: 2999, // USD 29.99 — igual que `price: 29.99` en products.ts
  },
}

export function getProduct(id) {
  return Object.prototype.hasOwnProperty.call(PRODUCTS, id) ? PRODUCTS[id] : undefined
}

/**
 * El archivo real de cada producto pago NUNCA vive en este repo (es
 * público en GitHub). Vive en Vercel Blob, y la URL de cada uno se guarda
 * en una env var — así el código fuente no revela dónde está el archivo.
 * Nombre de la env var para 'lut-ruptura' → LUT_BLOB_URL_LUT_RUPTURA
 */
function blobEnvKey(productId) {
  return `LUT_BLOB_URL_${productId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`
}

export function getBlobUrl(productId) {
  return process.env[blobEnvKey(productId)]
}

export function blobEnvKeyFor(productId) {
  return blobEnvKey(productId)
}
