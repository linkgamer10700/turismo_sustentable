FROM node:20-alpine

# Dependencias del sistema necesarias para Prisma en distribuciones Alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Optimización de caché Docker: copiar manifiestos primero
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Instalar dependencias exactas y generar cliente Prisma
RUN npm ci
RUN npx prisma generate

# Copiar el resto del código fuente del proyecto
COPY . .

# Variables de entorno para el proceso de compilación
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compilar la aplicación Next.js
RUN npm run build

# Preparar script de inicio asegurando formato de fin de línea Unix (evita problemas con CRLF de Windows)
COPY docker-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN tr -d '\r' < /usr/local/bin/entrypoint.sh > /usr/local/bin/entrypoint_unix.sh && \
    chmod +x /usr/local/bin/entrypoint_unix.sh && \
    mv /usr/local/bin/entrypoint_unix.sh /usr/local/bin/entrypoint.sh

# Puerto expuesto
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]
