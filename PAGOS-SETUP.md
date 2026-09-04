# Pasarela de pago — guía de puesta en marcha

Esto documenta cómo dejar cobrando de verdad la Shop (Stripe + Mercado Pago,
precios en USD, entrega automática del LUT al aprobarse el pago). El código
ya está escrito (`/api/*`) — lo que falta es lo que **nadie puede hacer por
vos**: crear las cuentas, verificarlas, y cargar las claves en Vercel.

No hace falta hacer todo esto de una — se puede probar todo con Stripe en
modo test sin cuenta bancaria vinculada, y sumar Mercado Pago después.

---

## 1. Stripe

1. Creá la cuenta en [dashboard.stripe.com/register](https://dashboard.stripe.com/register).
2. Mientras no actives la cuenta (verificación de identidad + banco), Stripe
   te deja trabajar en **modo test** con datos falsos — sirve para probar
   todo el flujo de punta a punta antes de cobrar un centavo real.
3. **Claves API**: Developers → API keys. Copiá la *Secret key*
   (`sk_test_...` en test, `sk_live_...` en producción) → va en la env var
   `STRIPE_SECRET_KEY`.
4. **Webhook**: Developers → Webhooks → Add endpoint.
   - URL: `https://tu-dominio/api/stripe-webhook`
   - Evento a escuchar: `checkout.session.completed`
   - Copiá el *Signing secret* (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`.
5. **Medios de pago**: Settings → Payment methods → activá los que quieras
   además de tarjeta (Link, Apple Pay, Google Pay suelen venir On por
   defecto y aparecen solos si el navegador del comprador los soporta — no
   hace falta tocar código para esto).
6. **Para activar cuenta real y que la plata te llegue a un banco**:
   Settings → Business settings → Account details, y completá identidad +
   cuenta bancaria. Ahí Stripe empieza a liquidar de verdad.
7. Cuando pases de test a producción, repetí los pasos 3 y 4 con las claves
   `sk_live_...` / el webhook en modo live (son claves y endpoints
   *distintos* de los de test).

## 2. Mercado Pago

> Ojo con esto: una cuenta de Mercado Pago de Argentina normalmente solo
> cobra en **pesos**, no en dólares — a diferencia de Stripe, MP no es
> multi-moneda. El código ya convierte el precio en USD a ARS al momento
> de generar el pago (`api/create-mp-preference.js`, cotización oficial de
> [dolarapi.com](https://dolarapi.com) con un valor fijo de respaldo). Es
> una aproximación razonable pero conviene probarla con la cuenta real
> antes de anunciarla — la disponibilidad de `currency_id` puede variar.

1. Creá la cuenta en [mercadopago.com.ar](https://www.mercadopago.com.ar) (o
   usá la que ya tengas) y vinculá el banco/CBU donde quieras recibir la
   plata (Perfil → Datos bancarios).
2. **Credenciales**: [Tus integraciones](https://www.mercadopago.com.ar/developers/panel/app) →
   creá una aplicación → pestaña *Credenciales de producción* (y *de
   prueba* para testear primero). Copiá el *Access Token* →
   `MP_ACCESS_TOKEN`.
3. El webhook (`notification_url`) se manda solo en cada preferencia que
   crea `api/create-mp-preference.js` — no hace falta configurarlo a mano
   en el panel, aunque también podés dejarlo cargado ahí como respaldo:
   *Tus integraciones* → tu app → *Webhooks* →
   `https://tu-dominio/api/mp-webhook`.
4. `USD_ARS_RATE_FALLBACK`: un número (pesos por dólar) para cuando
   dolarapi.com no responde. Actualizalo cada tanto — no tiene que ser
   exacto al centavo, es solo la red de contención.

## 3. Vercel Blob (donde vive cada archivo pago)

Los LUTs pagos **no** van dentro del repo — el repo de GitHub es público,
así que cualquiera podría bajarlos directo del código sin pagar. En cambio
viven en Vercel Blob, y solo `/api/download` (después de confirmar el pago)
sabe dónde están.

1. Vercel Dashboard → tu proyecto → **Storage** → *Create Database* → *Blob*.
   Al conectarlo, Vercel agrega solo la env var `BLOB_READ_WRITE_TOKEN` al
   proyecto — no hay que copiarla a mano.
2. En tu máquina, dentro de la raíz del repo:
   ```bash
   npm install @vercel/blob
   vercel env pull .env.local     # trae BLOB_READ_WRITE_TOKEN a tu máquina
   node scripts/upload-lut.mjs lut-ruptura ".private/ruptura-lut.drx"
   ```
   (`vercel env pull` requiere tener el proyecto linkeado con `vercel link`
   una vez — si no usás la CLI de Vercel, también podés copiar el token a
   mano desde el Dashboard y exportarlo antes del `node scripts/...`.)
3. El script imprime la URL del archivo y el nombre exacto de la env var
   (`LUT_BLOB_URL_LUT_RUPTURA`) — cargala en Vercel → Settings →
   Environment Variables, y hacé un redeploy.
4. Para cada producto pago nuevo: agregalo primero en
   `api/_lib/catalog.js` (precio) y en `shop-app/src/data/products.ts`
   (lo visual), después subí el archivo con el mismo `productId`.

## 4. Probar antes de anunciar

- Con las claves de **test** de Stripe (`sk_test_...`) podés pagar con la
  tarjeta de prueba `4242 4242 4242 4242`, cualquier fecha futura y CVC.
  Confirmá que después de pagar la descarga arranca sola.
- Mercado Pago tiene su propio [modo de prueba con usuarios y tarjetas de
  test](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards) —
  usalo antes de cargar las credenciales de producción.
- Local: `npm run build` en `shop-app/` + copiar `dist/` a
  `proyectos/shop/` no alcanza para probar pagos, porque hace falta que
  corran las funciones de `/api`. Para eso, desde la raíz del repo:
  `npx vercel dev` (pide login a Vercel la primera vez) — así corre el
  sitio completo con las funciones serverless activas, como en producción.

## 5. Qué falta a futuro (no bloquea nada de lo anterior)

- **Pedir el mail antes de descargar** (gratis y pagos): con Stripe y
  Mercado Pago, el comprador ya deja su mail al pagar — eso ya está. Lo
  que falta es el mail para el LUT **gratis**, que hoy se descarga directo
  sin pedir nada. Cuando quieran sumarlo, es un formulario chico + un
  endpoint que guarda el mail antes de destrabar el link — no toca nada
  de lo que ya está armado acá.
- **Pagos que tardan en aprobarse** (Rapipago, Pago Fácil, transferencia en
  Mercado Pago): la descarga automática funciona perfecto para pagos que
  se aprueban al toque (tarjeta, wallet). Para los que tardan días, el
  comprador ya no está en la página cuando se aprueba — para que la
  descarga le llegue igual hace falta mandarla por mail, lo cual pide lo
  mismo que el punto anterior (tener su mail guardado). Vale la pena tener
  esto en cuenta si van a habilitar esos medios de pago en Mercado Pago.
