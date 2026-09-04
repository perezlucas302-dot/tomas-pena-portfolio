// Webhook / IPN de Mercado Pago. MP llama acá cada vez que cambia el
// estado de un pago (incluidos los que tardan — Rapipago, Pago Fácil,
// transferencia), a veces por GET con `data.id` en la URL, a veces por
// POST con `{ data: { id } }` en el body — por eso este handler acepta
// los dos métodos y prueba ambas formas de sacar el id.
//
// Igual que con Stripe, /api/download vuelve a verificar el pago directo
// contra la API de MP antes de entregar el archivo — este webhook no es
// lo único que decide si se puede descargar.
//
// Se registra solo (notification_url) al crear cada preferencia, ver
// create-mp-preference.js — no hace falta configurar nada a mano.

import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

async function handleNotification(request) {
  try {
    const url = new URL(request.url)
    let paymentId = url.searchParams.get('data.id') || url.searchParams.get('id')

    if (!paymentId && request.method === 'POST') {
      try {
        const body = await request.json()
        paymentId = body?.data?.id
      } catch {
        // body vacío o no-JSON — nada que hacer
      }
    }

    if (paymentId) {
      const payment = new Payment(client)
      const info = await payment.get({ id: String(paymentId) })
      console.log('[mercadopago] notificación:', paymentId, info.status, info.metadata?.productId)
    }
  } catch (err) {
    console.error('Error procesando webhook de Mercado Pago:', err)
  }

  // Siempre 200: si le devolvemos error, Mercado Pago reintenta sin parar.
  return new Response('ok', { status: 200 })
}

export const GET = handleNotification
export const POST = handleNotification
