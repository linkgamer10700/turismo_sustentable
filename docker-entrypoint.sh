#!/bin/sh
set -e

echo "==> Verificando disponibilidad de la base de datos MySQL..."
max_retries=30
counter=0

until npx prisma db push --skip-generate --accept-data-loss; do
  counter=$((counter + 1))
  if [ $counter -ge $max_retries ]; then
    echo "==> Error: No fue posible conectar con MySQL luego de $max_retries intentos."
    exit 1
  fi
  echo "==> MySQL aun no esta listo para recibir conexiones (intento $counter/$max_retries). Reintentando en 3 segundos..."
  sleep 3
done

echo "==> Esquema de base de datos sincronizado correctamente."

echo "==> Ejecutando seed de datos iniciales..."
npx tsx prisma/seed.ts || echo "==> Aviso: Seed ya ejecutado o continuado con exito."

echo "==> Iniciando servidor Next.js..."
exec "$@"
