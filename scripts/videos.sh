#!/usr/bin/env bash
# ============================================================
# video.sh — herramientas de video para el portfolio
#
# USO:
#   ./scripts/video.sh compress                     (todos los de raw/)
#   ./scripts/video.sh compress mi-video.mov         (solo uno)
#   ./scripts/video.sh hover assets/video/mi-proyecto-web.mp4 mi-proyecto
#
# Requiere ffmpeg instalado:
#   sudo apt update && sudo apt install ffmpeg
#
# ⚠️ IMPORTANTE (compress): dejá que termine solo. Si lo cancelás a
# mitad de camino (Ctrl+C / Q) el archivo que estaba procesando en
# ese momento queda incompleto/roto en web/ — borralo y volvé a correr.

#DIRECTORIO: cd ../../mnt/c/users/lucas/desktop/portafolio/tomas-pena
# ============================================================

set -e

CMD="$1"
shift || true

# ============================================================
# compress — video crudo -> mp4 liviano para el sitio
# ============================================================
RAW_DIR="raw"
OUT_DIR="web"
SCALE="1920:-2"
CRF=24          # 23-26 es un buen rango para web. Más alto = más liviano.
PRESET="slow"   # mejor compresión, tarda un poco más

compress_one () {
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

run_compress () {
  mkdir -p "$OUT_DIR"

  if [ $# -eq 0 ]; then
    echo "Buscando archivos en ./$RAW_DIR para comprimir..."
    if [ -z "$(ls -A $RAW_DIR 2>/dev/null)" ]; then
      echo "La carpeta $RAW_DIR está vacía o no existe."
      exit 0
    fi
    for filepath in "$RAW_DIR"/*; do
      if [ -f "$filepath" ]; then
        filename=$(basename -- "$filepath")
        name="${filename%.*}"
        compress_one "$filename" "$name"
      fi
    done
  else
    input_file="$1"
    name="${input_file%.*}"
    compress_one "$input_file" "$name"
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
}

# ============================================================
# hover — clip corto y liviano para el preview de las work-cards
# ============================================================
run_hover () {
  local SRC="$1"
  local SLUG="$2"

  if [ -z "$SRC" ] || [ -z "$SLUG" ]; then
    echo "Uso: ./scripts/video.sh hover <video-origen.mp4> <slug-del-proyecto>"
    exit 1
  fi

  mkdir -p assets/video/hover
  local OUT="assets/video/hover/${SLUG}-hover.mp4"

  ffmpeg -y -ss 1 -i "$SRC" -t 4 -vf "scale=640:-2" -an \
    -c:v libx264 -crf 26 -preset slow -movflags +faststart \
    "$OUT" -loglevel error

  echo "Listo: $OUT ($(du -h "$OUT" | cut -f1))"
}

# ============================================================
# dispatcher
# ============================================================
case "$CMD" in
  compress)
    run_compress "$@"
    ;;
  hover)
    run_hover "$@"
    ;;
  *)
    echo "Uso:"
    echo "  ./scripts/video.sh compress                (todos los de raw/)"
    echo "  ./scripts/video.sh compress mi-video.mov    (solo uno)"
    echo "  ./scripts/video.sh hover <video-web.mp4> <slug>"
    exit 1
    ;;
esac