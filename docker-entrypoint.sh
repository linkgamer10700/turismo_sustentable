#!/bin/sh
set -e

npx prisma db push --skip-generate --accept-data-loss

npx tsx prisma/seed.ts || echo "==> Aviso: Seed ya ejecutado o continuado con éxito."

exec "$@"
