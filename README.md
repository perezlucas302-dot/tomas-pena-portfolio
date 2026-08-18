# Tomas Peña — Portfolio

Sitio del portfolio de Tomas Peña (editor audiovisual y filmmaker, Paraná, Entre Ríos). Es un sitio estático (HTML/CSS/JS vanilla) sin build step — abrí `index.html` y anda — más un sub-proyecto en React (`shop-app/`) que se compila aparte y su resultado se copia dentro del sitio estático, en `proyectos/shop/`.

## Estructura

```
tomas-pena/
├── index.html                 → Home (Hero, Proyectos, Servicios, Banner, Sobre mí, Contacto)
├── css/style.css              → Todos los estilos del sitio (tokens de diseño arriba del archivo)
├── js/main.js                 → Nav, scroll reveal, reloj en vivo, typewriter, hover-preview de video, compare de color grading
├── assets/
│   ├── img/covers/            → Portadas de cada proyecto
│   ├── img/personal/          → Firma y foto de perfil
│   ├── img/services/          → Media de la sección Servicios
│   └── video/
│       ├── *.mp4              → Videos livianos ya listos para el sitio
│       └── hover/*-hover.mp4  → Clips cortos para el preview al pasar el mouse sobre cada work-card
├── proyectos/
│   ├── index.html             → "Todos los proyectos" (listado completo)
│   ├── <proyecto>.html        → Una página por proyecto (16 hoy)
│   └── shop/                  → Build compilado de shop-app/ (NO se edita a mano, ver más abajo)
├── shop-app/                  → Sub-proyecto React + TypeScript + Vite + Tailwind — la tienda de LUTs
├── scripts/videos.sh          → Comprimir videos crudos y generar los clips de hover
├── raw/                       → Videos crudos de Drive (pesados, nunca se sube al repo — está en .gitignore)
└── web/                       → Salida temporal de scripts/videos.sh (tampoco se sube — está en .gitignore)
```

## Cómo probarlo localmente

Con VS Code, instalá la extensión **Live Server** y hacé click derecho sobre `index.html` → "Open with Live Server". O desde la terminal:

```bash
python3 -m http.server 8000
# abrí http://localhost:8000
```

Esto sirve el sitio estático tal cual, incluyendo `proyectos/shop/` (ya compilado). Para tocar el código fuente de la shop ver la sección [Shop (shop-app)](#shop-shop-app) más abajo.

---

## Cómo seguir agregando proyectos nuevos

1. **Portada**: exportá/recortá una imagen de portada (JPG, ideal menos de 300KB — redimensionar a un ancho de ~1200-1600px y calidad 80-85). Guardala en `assets/img/covers/nombre-proyecto.jpg`.

2. **Card en la home**: en `index.html`, dentro de `<div class="work-grid">`, copiá uno de los bloques `.work-card` existentes y cambiá el link, la imagen y el título. Si el proyecto va a estar también en el listado completo, agregá el mismo bloque en `proyectos/index.html`.

3. **Página de detalle**: copiá cualquiera de los archivos en `proyectos/` (por ejemplo `cayo-amarillo.html`), renombralo a `nombre-proyecto.html`, y cambiá: el `<title>`, el `<h1 class="project-hero__title">`, la imagen/video en `project-media__frame`, y los links de `project-nav` al final (para que el carrusel "anterior/siguiente" quede bien enlazado entre todos).

4. **Video**: comprimí el crudo y generá el clip de hover con `scripts/videos.sh` (ver siguiente sección).

5. **Marquee**: sumá la portada nueva en las dos `.marquee__group` de `index.html` (la segunda es la copia `aria-hidden` para el loop infinito).

6. **Categoría**: por ahora casi todos van con la etiqueta "Edición" (`work-card__tag` y `project-hero__meta`) — usá "Director" u otra cuando corresponda.

---

## Videos: comprimir y generar el hover preview

Requiere `ffmpeg` instalado (`sudo apt install ffmpeg` en WSL/Ubuntu).

**Comprimir** un crudo de `raw/` a un `.mp4` liviano en `web/`:

```bash
chmod +x scripts/videos.sh
./scripts/videos.sh compress                # todos los de raw/
./scripts/videos.sh compress mi-video.mov   # solo uno
```

- Si el archivo comprimido pesa **menos de ~90MB**: copialo directo a `assets/video/` y listo, Vercel lo sirve solo.
- Si pesa **más de ~90MB**: subilo a Cloudinary (plan free) y usá esa URL en el `<source>` del `<video>` en vez de un archivo local.

**Clip corto para el hover** de una work-card (se reproduce al pasar el mouse encima en desktop, ver `js/main.js`):

```bash
./scripts/videos.sh hover assets/video/mi-proyecto-web.mp4 mi-proyecto
# genera assets/video/hover/mi-proyecto-hover.mp4
```

El slug pasado acá tiene que coincidir con el nombre del archivo `.html` del proyecto en `proyectos/` (sin extensión) — `main.js` arma la ruta del hover video a partir de esa URL.

⚠️ Dejá que `compress` termine solo: si lo cancelás a mitad de camino, el archivo que estaba procesando queda roto en `web/` — borralo y volvé a correr.

---

## Imágenes: mismo criterio en todo el sitio

Objetivo para cualquier imagen que se suba (portadas, fotos del hero, capturas antes/después): **ancho máximo ~1600px y menos de ~300KB**. Las fotos que salen directo de una cámara o de Drive suelen venir en 4K (3840×2160 o más) y pesar varios MB — eso ralentiza la carga sin sumar nada, porque ninguna card del sitio se ve a esa resolución.

Con Python + Pillow instalado (`pip install pillow`) el ajuste es así:

```python
from PIL import Image
im = Image.open("archivo.jpg").convert("RGB")
w, h = im.size
target_w = 1600
im = im.resize((target_w, int(h * target_w / w)), Image.LANCZOS)
im.save("archivo.jpg", "JPEG", quality=82, optimize=True)
```

(También sirve cualquier otra herramienta — Squoosh, ImageMagick, Photoshop "Guardar para web" — el criterio es el mismo: ~1600px de ancho, calidad 80-85.)

---

## Shop (`shop-app/`)

La tienda de LUTs vive como app aparte en React + TypeScript + Vite + Tailwind + Framer Motion, para poder tener más motion e interacción de la que da hacer todo a mano en vanilla JS. Ya tiene: entrada animada ("Scale Brutal"), header con video, sección "Colorización" (casos reales antes/después + el título con efecto martillo), grid de productos con scroll-reveal, y un LUT gratis con descarga real. Lo que sigue siendo demo: los botones de Stripe/Mercado Pago no cobran nada de verdad todavía.

### Cómo se integra con el sitio estático

`shop-app` se compila por separado y el resultado (`shop-app/dist/`) se copia a mano dentro de `proyectos/shop/`, que es lo que Vercel termina sirviendo en `/proyectos/shop`. **`proyectos/shop/` es un artefacto de build — no se edita directamente**, se edita el código fuente en `shop-app/src/` y se vuelve a generar.

```
shop-app/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css              → tokens copiados 1:1 de css/style.css para que no desentone
│   ├── lib/
│   │   ├── motion.ts           → curva de easing y duración de la entrada, compartidas
│   │   └── format.ts            → formatPrice / downloadFilename
│   ├── data/
│   │   ├── products.ts          → catálogo de LUTs a la venta
│   │   └── caseStudies.ts       → los 3 casos reales de "Colorización"
│   ├── types.ts
│   └── components/shop/
│       ├── EntryTransition.tsx  → la entrada animada
│       ├── ShopHeader.tsx       → hero con video de fondo
│       ├── ColorizacionSection.tsx
│       ├── CaseStudyCard.tsx
│       ├── ProductCard.tsx
│       ├── BeforeAfterSlider.tsx → slider antes/después (lo comparten las cards de arriba)
│       ├── CheckoutModal.tsx
│       └── ShopFooter.tsx
└── vite.config.ts             → base: './' — para que las rutas de assets funcionen relativas a donde se copie el build
```

### Desarrollo

```bash
cd shop-app
npm install     # primera vez
npm run dev     # levanta en localhost con hot reload
```

### Build y deploy (¡importante hacerlo bien!)

```bash
cd shop-app
npm run build            # genera shop-app/dist/
```

Después copiá el **contenido** de `shop-app/dist/` a `proyectos/shop/` (reemplazando lo que había):

```bash
cp -r shop-app/dist/. proyectos/shop/
```

**Ojo con esto**: `proyectos/shop/` (con barra, la carpeta de la shop) y `proyectos/index.html` (el listado de "Todos los proyectos") son cosas totalmente distintas. Ya pasó una vez que el build de la shop se copió por error encima de `proyectos/index.html` y se perdió la página de listado — asegurate de copiar siempre a `proyectos/shop/`, nunca a la raíz de `proyectos/`.

### Header con video (`ShopHeader.tsx`)

El hero de la Shop usa un solo clip de fondo a pantalla completa: `assets/video/shop/b-roll-timeline.mp4` (misma carpeta a nivel raíz que `assets/video/hover/`). Si el archivo no está, cae al degradé de fondo en vez de romper. Se probó también una variante con los 4 clips en grilla 2x2, pero se descartó a favor de esta — los otros 3 clips (`grade-before.mp4`, `grade-after.mp4`, `export-preview.mp4`) ya se borraron del repo. Después de tocar el video hay que recompilar la shop (`npm run build` en `shop-app/`) y volver a copiar `dist/` a `proyectos/shop/`.

### El LUT gratis y su descarga (`data/products.ts`)

El primer producto del catálogo es gratis (`price: 0`) — `ProductCard` y `CheckoutModal` cambian su copy y su botón solos cuando detectan precio 0 (dice "Gratis", el botón pasa a "Descargar ahora", sin Stripe/Mercado Pago). El archivo real a entregar va en el campo `downloadUrl` del producto, apuntando a `assets/luts/<archivo>` — sin ese campo, el botón queda deshabilitado con el aviso de que todavía no está listo, en vez de ofrecer un link roto. El nombre que ve quien descarga es el `title` del producto, no el nombre del archivo (lo arma `downloadFilename()` en `lib/format.ts`).

### Qué falta / roadmap

- Reemplazar las imágenes placeholder de Blue Hour Noir en `data/products.ts` por capturas antes/después reales.
- Conectar Stripe y/o Mercado Pago de verdad (hoy `CheckoutModal.tsx` no procesa ningún pago).
- La venta de SFX/audio quedó descartada — el catálogo por ahora es solo LUTs.
- El footer (`ShopFooter.tsx`) se deja como está a propósito — su rediseño todavía se está pensando. Sus links de "Términos y condiciones" / "Política de privacidad" todavía no tienen página real.
