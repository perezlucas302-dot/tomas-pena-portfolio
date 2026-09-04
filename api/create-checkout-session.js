// Crea una Stripe Checkout Session para un producto pago del catálogo.
// El front (CheckoutModal.tsx) llama a este endpoint y redirige al `url`
// que devuelve. Stripe se encarga de mostrar los medios de pago
// habilitados en el Dashboard (tarjeta, Link, Apple/Google Pay, etc.) —
// no hace falta listarlos a mano acá.

import Stripe from 'stripe'
import { getProduct } from './_lib/catalog.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  let productId
  try {
    ;({ productId } = await request.json())
  } catch {
    return Response.json({ error: 'Body inválido' }, { status: 400 })
  }

  const product = typeof productId === 'string' ? getProduct(productId) : undefined
  if (!product) {
    return Response.json({ error: 'Producto inválido' }, { status: 400 })
  }

  const site = process.env.SITE_URL || new URL(request.url).origin

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: product.priceUsdCents,
            product_data: { name: product.title },
          },
          quantity: 1,
        },
      ],
      // metadata queda pegado a la session y lo volvemos a leer en
      // /api/download para confirmar que el que paga se lleva EL producto
      // que pagó, no cualquier otro.
      metadata: { productId },
      // Cuentas nuevas de Stripe traen "Managed Payments" activado por
      // default (Stripe calcula y remite impuestos por vos) — exige un
      // tax_code por producto, que no tenemos. Lo desactivamos acá: sin
      // esto la venta de un LUT no incluye ningún cálculo de impuestos.
      managed_payments: { enabled: false },
      // Sin barra final antes del "?" a propósito: vercel.json tiene
      // trailingSlash:false, así que "/proyectos/shop/?..." dispara un
      // redirect 308 para sacar la barra — y ese redirect descarta el
      // query string entero, perdiendo checkout=success y compañía antes
      // de que la app llegue a leerlos (ver App.tsx / PaymentReturn.tsx).
      success_url: `${site}/proyectos/shop?checkout=success&provider=stripe&product=${encodeURIComponent(
        productId,
      )}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/proyectos/shop?checkout=cancel`,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('Error creando Checkout Session de Stripe:', err)
    return Response.json({ error: 'No se pudo iniciar el pago con Stripe' }, { status: 500 })
  }
}
