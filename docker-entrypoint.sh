#!/bin/sh
set -e

echo "--------------------------------------------------------"
echo "  Iniciando configuración de Base de Datos con Prisma"
echo "--------------------------------------------------------"

echo "==> Sincronizando esquema de base de datos..."
npx prisma db push --skip-generate

echo "==> Sembrando datos iniciales (Roles y Administrador)..."
npx tsx prisma/seed.ts || echo "==> Aviso: Seed ya ejecutado o continuado con éxito."

echo "--------------------------------------------------------"
echo "  Iniciando Servidor Next.js en el puerto 3000"
echo "--------------------------------------------------------"
exec "$@"
