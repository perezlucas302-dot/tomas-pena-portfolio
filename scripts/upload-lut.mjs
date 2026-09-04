#!/usr/bin/env node
// Sube un archivo de LUT pago a Vercel Blob y te dice exactamente qué env
// var configurar en Vercel para que /api/download lo encuentre.
//
// Uso:
//   BLOB_READ_WRITE_TOKEN=xxxx node scripts/upload-lut.mjs lut-ruptura ".private/ruptura-lut.drx"
//
// El token BLOB_READ_WRITE_TOKEN se consigue en Vercel Dashboard → tu
// proyecto → Storage → (crear un) Blob store → esa página te da el token
// para correr esto desde tu máquina. También queda seteado solo como env
// var del proyecto en Vercel una vez que conectás el Blob store — ese es
// el que usa /api/download en producción, no hace falta tocarlo a mano.
//
// Requiere: npm install @vercel/blob (una vez, en la raíz del repo).

import { put } from '@vercel/blob'
import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

const [, , productId, filePath] = process.argv

if (!productId || !filePath) {
  console.error('Uso: node scripts/upload-lut.mjs <productId> <ruta-al-archivo>')
  console.error('Ejemplo: node scripts/upload-lut.mjs lut-ruptura ./ruptura-lut.drx')
  process.exit(1)
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Falta la env var BLOB_READ_WRITE_TOKEN (Vercel Dashboard → Storage → tu Blob store).')
  process.exit(1)
}

const file = await readFile(filePath)
const blob = await put(`luts/${productId}/${basename(filePath)}`, file, {
  access: 'public',
  addRandomSuffix: true, // así la URL no es adivinable a partir del nombre del archivo
})

const envKey = `LUT_BLOB_URL_${productId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`

console.log('\n✔ Subido a Vercel Blob:', blob.url)
console.log('\nAhora andá a Vercel Dashboard → tu proyecto → Settings → Environment Variables y agregá:\n')
console.log(`  ${envKey} = ${blob.url}\n`)
console.log('Después de guardarla, hacé un redeploy para que /api/download la vea.')
