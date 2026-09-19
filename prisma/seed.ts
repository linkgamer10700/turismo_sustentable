import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Crear Usuario Admin por defecto
    const adminUser = await prisma.usuarios.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            nombre: 'Admin Test',
            email: 'admin@test.com',
            password_hash: hashedPassword,
            rol: 'Administrador',
        },
    })

    // Crear Usuario Negocio por defecto
    const negocioUser = await prisma.usuarios.upsert({
        where: { email: 'negocio@test.com' },
        update: {},
        create: {
            nombre: 'Negocio Test',
            email: 'negocio@test.com',
            password_hash: hashedPassword,
            rol: 'Proveedor',
        },
    })

    // Crear Usuario Turista por defecto
    const turistaUser = await prisma.usuarios.upsert({
        where: { email: 'turista@test.com' },
        update: {},
        create: {
            nombre: 'Turista Test',
            email: 'turista@test.com',
            password_hash: hashedPassword,
            rol: 'Turista',
        },
    })

    console.log({ adminUser, negocioUser, turistaUser })
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
