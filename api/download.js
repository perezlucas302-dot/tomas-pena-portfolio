// Entrega el archivo de un producto pago SOLO después de confirmar el
// pago directo contra la API del proveedor correspondiente (no confía en
// los parámetros de la URL por sí solos — session_id / payment_id son
// públicos, lo que importa es lo que Stripe/MP contestan al consultarlos).
//
// El archivo real nunca vive en este repo (es público en GitHub) — vive
// en Vercel Blob, y esta función es la única que conoce su URL (guardada
// en una env var por producto, ver api/_lib/catalog.js). El browser nunca
// ve esa URL, solo el resultado ya verificado.

import Stripe from 'stripe'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { getProduct, getBlobUrl } from './_lib/catalog.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

export async function GET(request) {
  const url = new URL(request.url)
  const provider = url.searchParams.get('provider')
  const productId = url.searchParams.get('product')
  const sessionId = url.searchParams.get('session_id')
  const paymentId = url.searchParams.get('payment_id')

  const product = productId ? getProduct(productId) : undefined
  if (!product) {
    return new Response('Producto inválido', { status: 400 })
  }

  let paid = false

  try {
    if (provider === 'stripe' && sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      paid =
        session.payment_status === 'paid' &&
        session.metadata?.productId === productId &&
        (session.amount_total ?? 0) >= product.priceUsdCents
    } else if (provider === 'mp' && paymentId) {
      const payment = new Payment(mpClient)
      const info = await payment.get({ id: paymentId })
      paid = info.status === 'approved' && (info.metadata?.productId ?? info.metadata?.product_id) === productId
    }
  } catch (err) {
    console.error('Error verificando el pago antes de descargar:', err)
    return new Response('No se pudo verificar el pago', { status: 500 })
  }

  if (!paid) {
    return new Response('Todavía no se confirmó el pago', { status: 402 })
  }

  const blobUrl = getBlobUrl(productId)
  if (!blobUrl) {
    console.error(`Falta la env var con el archivo de "${productId}" (ver api/_lib/catalog.js)`)
    return new Response('El archivo todavía no está disponible — contactanos', { status: 404 })
  }

  try {
    const fileRes = await fetch(blobUrl)
    if (!fileRes.ok || !fileRes.body) throw new Error(`blob respondió ${fileRes.status}`)

    const extension = blobUrl.split('.').pop()?.split('?')[0] || 'zip'
    const filename = `${product.title}.${extension}`.replace(/["\\]/g, '')
    // Content-Disposition solo acepta ISO-8859-1 puro en filename= — el
    // título tiene una raya larga ("—") fuera de ese rango, que rompía el
    // header entero (TypeError: ByteString) y tiraba abajo la descarga
    // completa. Fallback ASCII ahí, nombre real (con tildes y raya) en
    // filename* (RFC 6266), que es el que usan los navegadores modernos.
    const asciiFallback = filename.replace(/[^\x20-\x7E]/g, '-')

    return new Response(fileRes.body, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Content-Type': 'application/octet-stream',
      },
    })
  } catch (err) {
    console.error('Error leyendo el archivo desde Vercel Blob:', err)
    return new Response('No se pudo entregar el archivo', { status: 502 })
  }
}
