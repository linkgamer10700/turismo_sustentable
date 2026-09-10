import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Crear Roles
    const adminRole = await prisma.rol.upsert({
        where: { nombre: 'Administrador' },
        update: {},
        create: {
            nombre: 'Administrador',
            descripcion: 'Rol con acceso total al sistema',
        },
    })

    const userRole = await prisma.rol.upsert({
        where: { nombre: 'Usuario' },
        update: {},
        create: {
            nombre: 'Usuario',
            descripcion: 'Rol para usuarios estándar',
        },
    })

    console.log({ adminRole, userRole })

    // Crear Usuario Admin por defecto
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const adminUser = await prisma.usuario.upsert({
        where: { correo: 'admin@test.com' },
        update: {},
        create: {
            nombre: 'Admin Test',
            correo: 'admin@test.com',
            contrasena: hashedPassword,
            rolId: adminRole.id,
            telefono: '1234567890',
            emailVerificado: true,
        },
    })

    console.log({ adminUser })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
