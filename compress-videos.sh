#!/usr/bin/env bash
# ============================================================
# compress-videos.sh
# Comprime videos a un MP4 liviano y compatible para la web.
#
# USO — TODOS de una (comprime todos los archivos en raw/):
#   ./compress-videos.sh
#
# USO — SOLO UNO (recomendado si solo agregaste/cambiaste uno):
#   ./compress-videos.sh mi-video.mp4
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

# ============================================================
# Lógica de ejecución
# ============================================================

if [ $# -eq 0 ]; then
  # Si no se pasan argumentos, procesar todos los archivos en raw/
  echo "Buscando archivos en ./$RAW_DIR para comprimir..."
  
  # Fijarse si la carpeta raw está vacía
  if [ -z "$(ls -A $RAW_DIR 2>/dev/null)" ]; then
    echo "La carpeta $RAW_DIR está vacía o no existe."
    exit 0
  fi

  for filepath in "$RAW_DIR"/*; do
    # Validar que sea un archivo (ignorar subcarpetas por si acaso)
    if [ -f "$filepath" ]; then
      filename=$(basename -- "$filepath") # Obtiene ej: "video.mov"
      name="${filename%.*}"               # Le quita la extensión, ej: "video"
      compress "$filename" "$name"
    fi
  done
else
  # Si se pasa un argumento, procesar solo ese archivo
  input_file="$1"
  name="${input_file%.*}"
  compress "$input_file" "$name"
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