// Webhook de Stripe. Sirve sobre todo para tener un registro server-side
// de cada pago aprobado (log) y como lugar natural donde en el futuro se
// puede mandar el mail de confirmación / guardar el email del comprador.
// La descarga en sí NO depende de este webhook: /api/download vuelve a
// verificar la session directo contra la API de Stripe, así que aunque
// este webhook fallara o llegara tarde, la descarga sigue funcionando.
//
// Hay que registrar esta URL (https://tu-sitio/api/stripe-webhook) en
// Stripe Dashboard → Developers → Webhooks, escuchando el evento
// "checkout.session.completed".

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  // request.text() da el body crudo tal cual llegó — imprescindible para
  // verificar la firma, un body ya parseado a JSON no sirve para esto.
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Firma de webhook de Stripe inválida:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    console.log(
      '[stripe] pago aprobado:',
      session.id,
      session.metadata?.productId,
      session.customer_details?.email,
      `${(session.amount_total ?? 0) / 100} ${session.currency}`,
    )
  }

  return Response.json({ received: true })
}
