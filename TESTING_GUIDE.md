# Guía de Pruebas de Autenticación

## Estado Actual
El servidor de desarrollo está corriendo en **http://localhost:3000**

## Problema Detectado
❌ La conexión a la base de datos tiene un problema con la variable `DATABASE_URL` en el archivo `.env`

## Pasos para Probar el Login

### Opción 1: Configurar la Base de Datos (Recomendado)

1. **Verifica tu archivo `.env`**
   - Asegúrate de que tenga una línea válida como:
   ```
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_base_datos"
   ```

2. **Ejecuta las migraciones o push**
   ```bash
   npx prisma db push
   ```

3. **Crea datos de prueba**
   ```bash
   npx tsx prisma/seed.ts
   ```
   
   Esto creará:
   - **Rol Administrador** y **Rol Usuario**
   - **Usuario de prueba**: 
     - Email: `admin@test.com`
     - Password: `admin123`

4. **Prueba el login**
   - Ve a http://localhost:3000/login
   - Ingresa:
     - Email: `admin@test.com`
     - Password: `admin123`
   - Deberías ser redirigido a `/admin/dashboard`

### Opción 2: Crear Usuario Manualmente en la Base de Datos

Si prefieres crear el usuario directamente en la base de datos:

1. Ejecuta este SQL en tu base de datos MySQL:

```sql
-- Crear roles
INSERT INTO Rol (id, nombre, descripcion, creado_en, actualizado_en)
VALUES 
  (UUID(), 'Administrador', 'Rol con acceso total', NOW(), NOW()),
  (UUID(), 'Usuario', 'Rol estándar', NOW(), NOW());

-- Obtén el ID del rol Administrador
SET @admin_role_id = (SELECT id FROM Rol WHERE nombre = 'Administrador' LIMIT 1);

-- Crear usuario admin (la contraseña hasheada es para 'admin123')
INSERT INTO Usuario (id, correo, contrasena, nombre, rolId, emailVerificado, activo, creado_en, actualizado_en)
VALUES (
  UUID(),
  'admin@test.com',
  '$2a$10$YourHashedPasswordHere', -- Necesitas hashear 'admin123' con bcrypt
  'Admin Test',
  @admin_role_id,
  1,
  1,
  NOW(),
  NOW()
);
```

## URLs Disponibles

- **Login Admin**: http://localhost:3000/login
- **Login Usuario**: http://localhost:3000/login/loginUser
- **Registro**: http://localhost:3000/register
- **Dashboard Admin**: http://localhost:3000/admin/dashboard
- **Dashboard Usuario**: http://localhost:3000/dashboard

## Funcionalidades Implementadas

✅ Formularios de login con validación
✅ Hashing de contraseñas con bcryptjs
✅ Autenticación con NextAuth v5 (Credentials provider)
✅ Sesiones JWT
✅ Páginas de dashboard protegidas
✅ Redirección automática si no estás autenticado
✅ Alertas de error en formularios

## Próximos Pasos Sugeridos

1. Configurar correctamente `DATABASE_URL` en `.env`
2. Ejecutar `npx prisma db push` para crear las tablas
3. Ejecutar el seed para crear datos de prueba
4. Probar el flujo completo de registro → login → dashboard
