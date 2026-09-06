# Shop — Tomas Peña

Sub-proyecto en React + TypeScript + Vite + Tailwind + Framer Motion. Es la tienda de LUTs del portfolio — se compila acá y el resultado se copia a mano a `../proyectos/shop/` en el sitio estático principal (ver el README de la raíz del repo para el flujo de build/deploy completo).

## Desarrollo

```bash
npm install     # primera vez
npm run dev     # localhost con hot reload
```

## Build

```bash
npm run build            # genera dist/
```

Después, desde la raíz del repo, copiar el contenido de `dist/` a `proyectos/shop/` (reemplazando lo que había) — el README de la raíz tiene el detalle exacto y la advertencia de por qué no hay que copiarlo a `proyectos/` a secas.

## Estructura

```
src/
├── App.tsx
├── main.tsx
├── index.css                  → tokens copiados 1:1 de css/style.css del sitio principal
├── lib/
│   ├── motion.ts               → curva de easing y duración de la entrada, compartidas
│   └── format.ts                → formatPrice / downloadFilename
├── types.ts
├── data/
│   ├── products.ts              → catálogo de LUTs a la venta
│   └── caseStudies.ts           → los 3 casos reales de la sección "Colorización"
└── components/shop/
    ├── EntryTransition.tsx      → "Scale Brutal", la entrada animada
    ├── ShopHeader.tsx           → hero con video de fondo
    ├── ColorizacionSection.tsx  → título "Colorización" (martillo) + salpicón + cards de caso real
    ├── CaseStudyCard.tsx        → una card de caso real (con la pincelada bajo el título, atada al scroll)
    ├── ProductCard.tsx          → una card de producto en venta
    ├── BeforeAfterSlider.tsx    → el slider arrastrable antes/después (lo comparten ambas cards de arriba)
    ├── CheckoutModal.tsx        → resumen de compra — lleva a Gumroad o descarga gratis según el precio
    ├── PaymentReturn.tsx        → pantalla al volver del pago — dispara la descarga sola si se aprobó
    └── ShopFooter.tsx
```

## Pagos (Gumroad)

El producto pago se compra en Gumroad (`product.gumroadUrl` en
`data/products.ts`) — es un link externo, `CheckoutModal.tsx` no llama a
ningún `/api/*` para esto. Mercado Pago quedó implementado en `/api/*` (raíz
del repo) por si se reactiva, ver [`../PAGOS-SETUP.md`](../PAGOS-SETUP.md).

## Qué falta / roadmap

- Ruptura LUT todavía no tiene descripción definitiva (`src/data/products.ts`).
- Pedir el mail antes de descargar el LUT gratis (los pagos ya lo piden solos al procesar el pago).
- Los links de "Términos y condiciones" / "Política de privacidad" del footer todavía no tienen página real.
