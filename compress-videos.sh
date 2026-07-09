#!/usr/bin/env bash
# ============================================================
# compress-videos.sh
# Comprime videos a un MP4 liviano y compatible para la web.
#
# USO — TODOS de una (comprime los 4 que encuentre en raw/):
#   ./compress-videos.sh
#
# USO — SOLO UNO (recomendado si ya tenés el resto comprimido
# y solo agregaste/cambiaste un video puntual):
#   ./compress-videos.sh cayo-amarillo
#   ./compress-videos.sh torre-faro
#   ./compress-videos.sh ya-vuelvo
#   ./compress-videos.sh banner-web1
#
# Los nombres esperados en ./raw son:
#   raw/torre-faro.mov
#   raw/ya-vuelvo.mov
#   raw/cayo-amarillo.mp4
#   raw/banner-web1.mov
#
# Requiere ffmpeg instalado:
#   sudo apt update && sudo apt install ffmpeg
#
# ⚠️ IMPORTANTE: dejá que termine solo. Si lo cancelás a mitad de
# camino (Ctrl+C / Q) el archivo que estaba procesando en ese
# momento queda incompleto/roto en web/ — borralo y volvé a correr.
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
      -c:v libx264 -profile:v main -level 3.1 -crf $CRF -preset $PRESET -pix_fmt yuv420p \
      -c:a aac -b:a 128k \
      -movflags +faststart \
      "$OUT_DIR/$name-web.mp4"
    echo "✓ Listo: $OUT_DIR/$name-web.mp4 ($(du -h "$OUT_DIR/$name-web.mp4" | cut -f1))"
  else
    echo "⚠ No encontré $RAW_DIR/$input — saltealo o revisá el nombre."
  fi
}

# Mapa: alias que escribís en la terminal -> archivo real en raw/
run_one () {
  case "$1" in
    torre-faro)    compress "torre-faro.mov"    "torre-faro" ;;
    ya-vuelvo)     compress "ya-vuelvo.mov"      "ya-vuelvo" ;;
    cayo-amarillo) compress "cayo-amarillo.mp4"  "cayo-amarillo" ;;
    banner-web1)   compress "banner-web1.mov"    "banner-web1" ;;
    *)
      echo "⚠ No reconozco '$1'. Opciones válidas: torre-faro, ya-vuelvo, cayo-amarillo, banner-web1"
      exit 1
      ;;
  esac
}

if [ -n "$1" ]; then
  # Se pasó un nombre puntual -> comprimir solo ese
  run_one "$1"
else
  # Sin argumentos -> comprimir los 4
  compress "torre-faro.mov"    "torre-faro"
  compress "ya-vuelvo.mov"     "ya-vuelvo"
  compress "cayo-amarillo.mp4" "cayo-amarillo"
  compress "banner-web1.mov"   "banner-web1"
fi

echo ""
echo "============================================================"
echo "Listo. Los archivos comprimidos están en ./$OUT_DIR"
echo ""
echo "SI CADA ARCHIVO PESA MENOS DE ~90MB:"
echo "  Copialos directo a tomas-pena/assets/video/ y listo,"
echo "  se sirven solitos desde Vercel. No necesitás Cloudinary."
echo ""
echo "SI ALGUNO PESA MÁS DE ~90MB:"
echo "  Subilo a Cloudinary (plan free) y pegá esa URL en el"
echo "  <source> del video en vez del archivo local."
echo "============================================================"
