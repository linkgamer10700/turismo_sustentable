# Proyecto de Turismo Sustentable

Sistema web desarrollado con **Next.js**, **React**, **Tailwind CSS**, **Prisma ORM**, **NextAuth v5** y **MySQL**, completamente contenedorizado con **Docker** para garantizar reproducibilidad en cualquier entorno.

---

## 🚀 Inicio Rápido con Docker (Recomendado)

No requieres instalar Node.js ni MySQL en tu sistema. Solo necesitas tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### 1. Clonar el repositorio y levantar los contenedores

```bash
docker compose up --build
```

Al ejecutar este comando:
1. Se levanta el contenedor de la base de datos **MySQL 8.0** (`turismo_db`).
2. Se espera a que la base de datos esté lista y saludable (*healthcheck*).
3. Se compila y empaqueta la aplicación **Next.js** (`turismo_app`).
4. Se aplican automáticamente las tablas de la base de datos con `prisma db push`.
5. Se insertan automáticamente los datos iniciales de prueba (roles y usuario admin) mediante `prisma/seed.ts`.

### 2. Acceder a la aplicación

Abre tu navegador en:
- **Página Principal**: [http://localhost:3000](http://localhost:3000)
- **Inicio de Sesión Administrador**: [http://localhost:3000/login](http://localhost:3000/login)
- **Inicio de Sesión Usuario**: [http://localhost:3000/login/loginUser](http://localhost:3000/login/loginUser)
- **Registro de Usuario**: [http://localhost:3000/register](http://localhost:3000/register)

### 3. Credenciales de Prueba (Sembradas automáticamente)

- **Email**: `admin@test.com`
- **Contraseña**: `admin123`
- **Rol**: `Administrador` (Redirige al dashboard en `/admin/dashboard`)

---

## 🛠️ Comandos útiles de Docker

| Acción | Comando |
| :--- | :--- |
| Iniciar en segundo plano (*detached*) | `docker compose up -d` |
| Detener contenedores | `docker compose down` |
| Detener y borrar volúmenes (reiniciar DB desde cero) | `docker compose down -v` |
| Ver registros (*logs*) en tiempo real | `docker compose logs -f app` |
| Ejecutar comandos de Prisma dentro del contenedor | `docker compose exec app npx prisma studio` |

---

## 💻 Desarrollo Local (Sin Docker)

Si prefieres ejecutar el proyecto localmente en tu máquina:

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   Copia el archivo `.env.example` como `.env` y ajusta tu conexión a MySQL:
   ```bash
   cp .env.example .env
   ```

3. **Sincronizar base de datos y crear datos iniciales**:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```