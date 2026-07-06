#!/usr/bin/env bash
# ============================================================
# compress-videos.sh
# Comprime los videos de Torre Faro / Ya Vuelvo / Cayo Amarillo
# a un MP4 liviano listo para la web.
#
# USO:
#   1) Descargá los videos originales desde Drive a la carpeta ./raw
#      (click derecho en Drive → Descargar). Nombralos EXACTO así:
#         raw/torre-faro.mov
#         raw/ya-vuelvo.mov
#         raw/cayo-amarillo.mp4
#         raw/banner-web1.mov   (el video de 1 segundo del banner)
#   2) chmod +x compress-videos.sh
#   3) ./compress-videos.sh
#
# Requiere ffmpeg instalado:
#   sudo apt update && sudo apt install ffmpeg
# ============================================================

set -e

RAW_DIR="raw"
OUT_DIR="web"
mkdir -p "$OUT_DIR"

# ancho máximo (bajá a 1280 si querés archivos más chicos todavía)
SCALE="1920:-2"
CRF=24          # 23-26 es un buen rango para web. Más alto = más liviano.
PRESET="slow"   # mejor compresión, tarda un poco más

compress () {
  local input="$1"
  local name="$2"
  if [ -f "$RAW_DIR/$input" ]; then
    echo "→ Comprimiendo $input ..."
    ffmpeg -y -i "$RAW_DIR/$input" \
      -vf "scale=$SCALE" \
      -c:v libx264 -crf $CRF -preset $PRESET \
      -c:a aac -b:a 128k \
      -movflags +faststart \
      "$OUT_DIR/$name-web.mp4"
    echo "✓ Listo: $OUT_DIR/$name-web.mp4 ($(du -h "$OUT_DIR/$name-web.mp4" | cut -f1))"
  else
    echo "⚠ No encontré $RAW_DIR/$input — saltealo o revisá el nombre."
  fi
}

compress "torre-faro.mov"    "torre-faro"
compress "ya-vuelvo.mov"     "ya-vuelvo"
compress "cayo-amarillo.mp4" "cayo-amarillo"
compress "banner-web1.mov"   "banner-web1"

echo ""
echo "============================================================"
echo "Listo. Los archivos comprimidos están en ./$OUT_DIR"
echo ""
echo "SI CADA ARCHIVO PESA MENOS DE ~90MB:"
echo "  Copialos directo a tomas-pena/assets/video/ y listo,"
echo "  se sirven solitos desde GitHub Pages/Vercel. No necesitás"
echo "  ningún servicio externo."
echo ""
echo "SI ALGUNO PESA MÁS DE ~90MB (probable con Torre Faro si es largo):"
echo "  Subilo a Cloudinary (plan free) o Vimeo/YouTube no listado,"
echo "  y pegá esa URL en el <source> del video en vez del archivo local."
echo "============================================================"
