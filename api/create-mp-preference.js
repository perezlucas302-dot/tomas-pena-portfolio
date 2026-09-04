// Crea una preferencia de Mercado Pago (Checkout Pro) para un producto
// pago del catálogo. El front redirige al `url` (init_point) que devuelve.
//
// OJO — esto necesita probarse con una cuenta real de Mercado Pago antes
// de ir a producción: una cuenta de Mercado Pago de Argentina normalmente
// solo puede cobrar en pesos (ARS), no en dólares — a diferencia de
// Stripe, MP no es multi-moneda. Por eso acá convertimos el precio en
// USD a ARS al momento de generar la preferencia, usando una cotización
// en vivo (dolarapi.com, oficial, sin necesitar API key) con un valor
// fijo de respaldo si esa consulta falla. Confirmá en tu cuenta de MP
// qué currency_id te deja usar antes de activar esto de verdad.

import { MercadoPagoConfig, Preference } from 'mercadopago'
import { getProduct } from './_lib/catalog.js'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

async function getUsdArsRate() {
  try {
    const r = await fetch('https://dolarapi.com/v1/dolares/oficial')
    if (r.ok) {
      const data = await r.json()
      const rate = Number(data?.venta)
      if (Number.isFinite(rate) && rate > 0) return rate
    }
  } catch (err) {
    console.error('No se pudo obtener la cotización en vivo, uso fallback:', err.message)
  }
  const fallback = Number(process.env.USD_ARS_RATE_FALLBACK)
  return Number.isFinite(fallback) && fallback > 0 ? fallback : null
}

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

  const rate = await getUsdArsRate()
  if (!rate) {
    console.error('Sin cotización USD→ARS disponible (ni en vivo ni fallback en USD_ARS_RATE_FALLBACK)')
    return Response.json({ error: 'No se pudo calcular el precio en pesos' }, { status: 500 })
  }

  const priceUsd = product.priceUsdCents / 100
  const priceArs = Math.round(priceUsd * rate * 100) / 100

  const site = process.env.SITE_URL || new URL(request.url).origin

  try {
    const preference = new Preference(client)
    const result = await preference.create({
      body: {
        items: [
          {
            id: productId,
            title: product.title,
            quantity: 1,
            unit_price: priceArs,
            currency_id: 'ARS',
          },
        ],
        metadata: { productId },
        // Sin barra final antes del "?" a propósito: vercel.json tiene
        // trailingSlash:false, así que "/proyectos/shop/?..." dispara un
        // redirect 308 para sacar la barra — y ese redirect descarta el
        // query string entero, perdiendo checkout=success y compañía
        // antes de que la app llegue a leerlos (ver App.tsx / PaymentReturn.tsx).
        back_urls: {
          success: `${site}/proyectos/shop?checkout=success&provider=mp&product=${encodeURIComponent(productId)}`,
          failure: `${site}/proyectos/shop?checkout=cancel`,
          pending: `${site}/proyectos/shop?checkout=pending`,
        },
        auto_return: 'approved',
        notification_url: `${site}/api/mp-webhook`,
      },
    })

    return Response.json({ url: result.init_point })
  } catch (err) {
    console.error('Error creando preferencia de Mercado Pago:', err)
    return Response.json({ error: 'No se pudo iniciar el pago con Mercado Pago' }, { status: 500 })
  }
}
