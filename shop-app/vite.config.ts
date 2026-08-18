import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { serveSiteAssets } from './vite-plugins/serve-site-assets.js'

// Se compila para vivir en /proyectos/shop/ dentro del sitio estático
// existente (tomas-pena-portfolio), reemplazando el placeholder
// /proyectos/shop.html. Los assets quedan con rutas relativas para poder
// copiar la carpeta "dist" tal cual a esa ubicación.
export default defineConfig({
  base: './',
  // serveSiteAssets solo actúa en `vite dev`, no en el build de producción.
  plugins: [react(), tailwindcss(), serveSiteAssets()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
