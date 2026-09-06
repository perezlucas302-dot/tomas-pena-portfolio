# Pasarela de pago — guía de puesta en marcha

Esto documenta cómo cobra la Shop hoy. **La vía real es Gumroad** (ver
sección 1) — Stripe se descartó del todo (Argentina no está en su lista de
países soportados, no hay forma de tener cuenta propia sin armar una
empresa en el exterior) y Mercado Pago quedó implementado pero en espera
(código intacto, botón oculto en `CheckoutModal.tsx`).

---

## 1. Gumroad (vía activa)

Gumroad es un *Merchant of Record*: vende el producto en tu nombre, cobra
la tarjeta internacional y entrega el archivo — no pasa por `/api/*` ni por
Vercel Blob para nada, es 100% externo al repo.

1. Cuenta en [gumroad.com](https://gumroad.com) con mail personal — no
   hace falta empresa. Pide DNI (identificación con foto) y un comprobante
   de domicilio en Argentina (o empresa registrada, una cosa u otra).
2. **Payout method**: Bank Account (no PayPal, así no se lleva un 2% extra
   de comisión aparte) → cargar CBU + nombre exacto de la cuenta. Account
   type: Individual.
3. Crear el producto (precio, descripción, subir el archivo real del LUT)
   y copiar el link de la página (`Products` → el producto → *Share*).
4. Ese link va en `gumroadUrl` del producto correspondiente, en
   `shop-app/src/data/products.ts` — es lo único que conecta la Shop con
   Gumroad, no hace falta ninguna env var ni clave.

Comisión: 10% + 50¢ de Gumroad + 2,9% + 30¢ de la tarjeta en ventas
directas — más alto que Stripe, pero es lo que sale por no necesitar una
empresa en el exterior.

## 2. Mercado Pago (implementado, en espera)

> Ojo con esto: una cuenta de Mercado Pago de Argentina normalmente solo
> cobra en **pesos**, no en dólares — no es multi-moneda. El código ya
> convierte el precio en USD a ARS al momento
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

## 3. Vercel Blob (solo si se reactiva Mercado Pago)

Esto no aplica a Gumroad — ahí el archivo se sube directo a Gumroad y ellos
lo entregan. Es para el día que se reactive Mercado Pago: los LUTs pagos
**no** van dentro del repo (el repo de GitHub es público, cualquiera podría
bajarlos directo del código sin pagar) — viven en Vercel Blob, y solo
`/api/download` (después de confirmar el pago) sabe dónde están.

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

- **Gumroad**: probá el checkout real con tu propia tarjeta (Gumroad no
  tiene modo test) y confirmá que el archivo que se descarga es el
  correcto — es la única verificación que hace falta, no depende de nada
  del repo.
- Si se reactiva Mercado Pago, tiene su propio [modo de prueba con
  usuarios y tarjetas de
  test](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards) —
  usalo antes de cargar las credenciales de producción. Local: `npm run
  build` en `shop-app/` + copiar `dist/` a `proyectos/shop/` no alcanza
  para probarlo, porque hace falta que corran las funciones de `/api` —
  para eso, desde la raíz del repo: `npx vercel dev` (pide login a Vercel
  la primera vez).

## 5. Qué falta a futuro (no bloquea nada de lo anterior)

- **Pedir el mail antes de descargar** (gratis): comprando en Gumroad (o
  Mercado Pago, si se reactiva) el comprador ya deja su mail al pagar —
  eso ya está. Lo que falta es el mail para el LUT **gratis**, que hoy se
  descarga directo sin pedir nada. Cuando quieran sumarlo, es un
  formulario chico + un endpoint que guarda el mail antes de destrabar el
  link — no toca nada de lo que ya está armado acá.
- **Pagos que tardan en aprobarse** (Rapipago, Pago Fácil, transferencia en
  Mercado Pago): la descarga automática funciona perfecto para pagos que
  se aprueban al toque (tarjeta, wallet). Para los que tardan días, el
  comprador ya no está en la página cuando se aprueba — para que la
  descarga le llegue igual hace falta mandarla por mail, lo cual pide lo
  mismo que el punto anterior (tener su mail guardado). Vale la pena tener
  esto en cuenta si van a habilitar esos medios de pago en Mercado Pago.
