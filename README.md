# Tomás Peña — Portfolio

Sitio estático (HTML/CSS/JS vanilla). Sin build step, sin dependencias — abrí `index.html` y anda.

## Estructura

```
tomas-pena/
├── index.html               → Home (Hero, Proyectos, Servicios, Banner, Sobre mí, Contacto)
├── proyectos/
│   ├── torre-faro.html
│   ├── ya-vuelvo.html
│   └── cayo-amarillo.html
├── css/style.css            → Todos los estilos (tokens de diseño arriba del archivo)
├── js/main.js                → Nav, scroll reveal, reloj en vivo, typewriter
├── compress-videos.sh        → Script para comprimir los videos crudos de Drive
└── assets/
    ├── img/covers/            → Portadas ya optimizadas para web
    ├── img/personal/          → Firma y foto de perfil
    └── video/                 → Videos livianos listos para el sitio (vacío por ahora)
```

## Cómo probarlo localmente

Con VS Code, instalá la extensión **Live Server** y hacé click derecho sobre `index.html` → "Open with Live Server". O desde la terminal:

```bash
cd tomas-pena
python3 -m http.server 8000
# abrí http://localhost:8000
```

---

## 1) Subir los videos de los proyectos (Torre Faro, Ya Vuelvo, Cayo Amarillo)

Los videos originales de Drive son muy pesados para el repo (Torre Faro pesa 7.5GB). Como ya tenés cuenta en Cloudinary, el flujo es:

**Paso 1 — Descargar los videos crudos**

Bajá los 3 desde Drive a una carpeta `raw/` en la raíz del proyecto, con estos nombres exactos:
- `raw/torre-faro.mov`
- `raw/ya-vuelvo.mov`
- `raw/cayo-amarillo.mp4`

**Paso 2 — Comprimir**

Necesitás `ffmpeg` instalado (`sudo apt install ffmpeg` en WSL/Ubuntu). Después:

```bash
chmod +x compress-videos.sh
./compress-videos.sh
```

Esto te deja versiones livianas en `web/*.mp4` (mucho más chicas, listas para subir).

**Paso 3 — Subir a Cloudinary**

1. Entrá a [cloudinary.com](https://cloudinary.com) y logueate con tu cuenta.
2. En el **Media Library** (menú lateral), botón **Upload** (arriba a la derecha).
3. Arrastrá `web/torre-faro-web.mp4` (y repetí con los otros dos).
4. Cuando termine de subir, hacé click sobre el video ya subido → se abre el detalle → copiá la **URL** que dice algo como:
   `https://res.cloudinary.com/TU_CLOUD_NAME/video/upload/v1234567890/torre-faro-web.mp4`

**Paso 4 — Pegar la URL en la página del proyecto**

Abrí `proyectos/torre-faro.html` y reemplazá esto:

```html
<div class="project-media__frame">
  <img src="../assets/img/covers/torre-faro.jpg" alt="Torre Faro — fotograma">
</div>
```

por esto (con TU url de Cloudinary):

```html
<div class="project-media__frame">
  <video controls poster="../assets/img/covers/torre-faro.jpg">
    <source src="https://res.cloudinary.com/TU_CLOUD_NAME/video/upload/v.../torre-faro-web.mp4" type="video/mp4">
  </video>
</div>
```

Repetí para `ya-vuelvo.html` y `cayo-amarillo.html` con sus URLs correspondientes.

---

## 2) Subir el video del banner (home, entre Servicios y Sobre mí)

Este es más simple porque dura 1 segundo — va a pesar poco, así que **no necesita Cloudinary**, se sube directo al repo.

1. Descargá `VIDEO WEB 1.mov` de Drive a `raw/banner-web1.mov`.
2. Corré `./compress-videos.sh` de nuevo (ya está preparado para este archivo también) → te deja `web/banner-web1-web.mp4`.
3. Copiá ese archivo a `assets/video/banner-web1.mp4` (con ese nombre exacto, para que `index.html` lo encuentre sin tocar código):

```bash
cp web/banner-web1-web.mp4 assets/video/banner-web1.mp4
```

Listo — el banner ya lo va a mostrar en loop automático, sin sonido, sin controles.

---

## 3) Cómo seguir agregando proyectos nuevos

Cuando quieras sumar otro proyecto (de los que ya tenés en Drive: Fernet Branca, Suzuki Paraná, etc.):

1. **Portada**: exportá/recortá una imagen de portada (JPG, ideal menos de 300KB — podés usar el mismo truco que usamos: redimensionar a un ancho de ~1200-1600px y calidad 80-85). Guardala en `assets/img/covers/nombre-proyecto.jpg`.

2. **Card en la home**: en `index.html`, dentro de `<div class="work-grid">`, copiá uno de los bloques `.work-card` existentes y cambiá el link, la imagen y el título:

```html
<a href="proyectos/nombre-proyecto.html" class="work-card reveal">
  <div class="work-card__frame">
    <img src="assets/img/covers/nombre-proyecto.jpg" alt="Nombre Proyecto — producción audiovisual">
  </div>
  <div class="work-card__meta">
    <span class="work-card__title">Nombre Proyecto</span>
    <span class="work-card__tag">Edición</span>
  </div>
</a>
```

3. **Página de detalle**: copiá cualquiera de los archivos en `proyectos/` (por ejemplo `cayo-amarillo.html`), renombralo a `nombre-proyecto.html`, y cambiá: el `<title>`, el `<h1 class="project-hero__title">`, la imagen del `<img>` en `project-media__frame`, y los links de `project-nav` al final (para que el carrusel "anterior/siguiente" quede bien enlazado entre todos).

4. **Video**: mismo flujo que el punto 1 de esta guía — comprimir con `compress-videos.sh` (agregale una línea nueva al script si querés automatizarlo, o corré el comando de `ffmpeg` a mano) y subir a Cloudinary.

5. **Categoría**: por ahora todos van con la etiqueta "Edición" (`work-card__tag` y `project-hero__meta`) hasta que definamos las categorías reales de cada uno (Filmmaker, Dirección Creativa, etc.).
