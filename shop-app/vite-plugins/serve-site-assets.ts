import { existsSync, statSync, createReadStream } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
}

/**
 * SOLO para `npm run dev`. El sitio real vive un nivel arriba de shop-app/
 * y sirve sus imágenes desde /assets/... — acá replicamos esa misma ruta
 * para poder previsualizar cosas como la firma sin copiar nada al build.
 * No afecta a `npm run build`: esto nunca corre en producción, y las
 * imágenes reales las sigue sirviendo el repo principal, no este bundle.
 */
export function serveSiteAssets(): Plugin {
  // Este archivo vive en shop-app/vite-plugins/, la raíz del repo
  // (donde está la carpeta assets/ real) queda dos niveles arriba.
  const repoRoot = fileURLToPath(new URL('../..', import.meta.url))

  return {
    name: 'serve-site-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/assets/')) return next()

        const filePath = join(repoRoot, decodeURIComponent(req.url.split('?')[0]))
        if (!existsSync(filePath) || !statSync(filePath).isFile()) return next()

        res.setHeader('Content-Type', MIME[extname(filePath)] ?? 'application/octet-stream')
        createReadStream(filePath).pipe(res)
      })
    },
  }
}
