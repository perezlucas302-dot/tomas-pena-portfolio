import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { serveSiteAssets } from './vite-plugins/serve-site-assets.js'

// Se compila para vivir en /proyectos/shop/ dentro del sitio estático
// existente (tomas-pena-portfolio). Base ABSOLUTA a propósito (no './'):
// Vercel tiene trailingSlash:false, así que /proyectos/shop (como está
// linkeado en el nav, sin barra final) nunca redirige a .../shop/ — el
// navegador resuelve rutas relativas contra /proyectos/ (un nivel arriba,
// "shop" se trata como si fuera un archivo), y los assets tiran 404 =
// página en blanco. Con base absoluta no importa la barra final.
export default defineConfig({
  base: '/proyectos/shop/',
  // serveSiteAssets solo actúa en `vite dev`, no en el build de producción.
  plugins: [react(), tailwindcss(), serveSiteAssets()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
