import { PrismaClient, Rol, EstadoReserva } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Crear Usuario Admin por defecto
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            name: 'Admin Test',
            email: 'admin@test.com',
            passwordHash: hashedPassword,
            rol: Rol.ADMINISTRADOR,
        },
    })

    // Crear Usuario Negocio por defecto
    const negocioUser = await prisma.user.upsert({
        where: { email: 'negocio@test.com' },
        update: {},
        create: {
            name: 'Negocio Test',
            email: 'negocio@test.com',
            passwordHash: hashedPassword,
            rol: Rol.PROVEEDOR,
            proveedor: {
                create: {
                    nombreNegocio: 'Ecoturismo CDMX Test',
                    descripcionBreve: 'Experiencias sustentables en Xochimilco y Milpa Alta',
                    categoria: 'Ecoturismo',
                    alcaldiaCDMX: 'Xochimilco',
                    estadoValidacion: 'APROBADO',
                },
            },
        },
    })

    // Crear Usuario Turista por defecto
    const turistaUser = await prisma.user.upsert({
        where: { email: 'turista@test.com' },
        update: {},
        create: {
            name: 'Turista Test',
            email: 'turista@test.com',
            passwordHash: hashedPassword,
            rol: Rol.TURISTA,
            preferencias: {
                intereses: ['Naturaleza', 'Cultura'],
                estiloViaje: ['Bajo impacto', 'Ecológico'],
            },
        },
    })

    console.log({ adminUser, negocioUser, turistaUser })

    const proveedor = await prisma.proveedor.findUnique({
        where: { userId: negocioUser.id },
    })

    if (proveedor) {
        const exp1 = await prisma.experiencia.upsert({
            where: { id: 'seed-exp-xochimilco-1' },
            update: {},
            create: {
                id: 'seed-exp-xochimilco-1',
                proveedorId: proveedor.id,
                titulo: 'Ruta Ecoturística en Chinampas de Cuemanco',
                descripcion: 'Recorrido tradicional guiado en trajinera ecológica sin motor por los canales ancestrales de Cuemanco, promoviendo la agricultura sustentable de las chinampas y la conservación del ajolote.',
                categoria: 'Ecoturismo',
                alcaldiaCDMX: 'Xochimilco',
                ubicacionDetallada: 'Embarcadero Cuemanco, Antiguo Canal 135',
                precio: 450.00,
                duracionMinutos: 180,
                capacidadCarga: 12,
                imagenes: [
                    'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80',
                ],
                activo: true,
            },
        })

        const exp2 = await prisma.experiencia.upsert({
            where: { id: 'seed-exp-tlalpan-2' },
            update: {},
            create: {
                id: 'seed-exp-tlalpan-2',
                proveedorId: proveedor.id,
                titulo: 'Senderismo de Conservación en el Bosque de Tlalpan',
                descripcion: 'Caminata de bajo impacto ambiental con biólogos locales para la identificación de flora nativa, recolección responsable y concientización sobre áreas naturales protegidas de la CDMX.',
                categoria: 'Naturaleza',
                alcaldiaCDMX: 'Tlalpan',
                ubicacionDetallada: 'Camino a Santa Teresa s/n, Bosque de Tlalpan',
                precio: 280.00,
                duracionMinutos: 150,
                capacidadCarga: 8,
                imagenes: [
                    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
                ],
                activo: true,
            },
        })

        const exp3 = await prisma.experiencia.upsert({
            where: { id: 'seed-exp-coyoacan-3' },
            update: {},
            create: {
                id: 'seed-exp-coyoacan-3',
                proveedorId: proveedor.id,
                titulo: 'Taller de Gastronomía Prehispánica y Maíces Criollos',
                descripcion: 'Experiencia culinaria interactiva con ingredientes agroecológicos de productores del suelo de conservación de Milpa Alta y Tláhuac, cocinados con técnicas tradicionales en Coyoacán.',
                categoria: 'Gastronomía',
                alcaldiaCDMX: 'Coyoacán',
                ubicacionDetallada: 'Centro Histórico de Coyoacán, Calle Francisco Sosa',
                precio: 650.00,
                duracionMinutos: 120,
                capacidadCarga: 10,
                imagenes: [
                    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
                ],
                activo: true,
            },
        })

        console.log({ exp1, exp2, exp3 })

        // Seed de Reserva de prueba para turista@test.com
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 5);
        const yyyy = targetDate.getUTCFullYear();
        const mm = String(targetDate.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(targetDate.getUTCDate()).padStart(2, "0");
        const seedDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);

        const reservaSeed = await prisma.reserva.upsert({
            where: { codigoComprobante: 'ECO-SEED-XOCHI-001' },
            update: {},
            create: {
                id: 'seed-reserva-turista-1',
                userId: turistaUser.id,
                experienciaId: 'seed-exp-xochimilco-1',
                fecha: seedDate,
                numeroPersonas: 2,
                precioTotal: 900.00,
                estado: EstadoReserva.CONFIRMADA,
                codigoComprobante: 'ECO-SEED-XOCHI-001',
                notasEspeciales: 'Reserva de prueba inicial para recorrido ecológico en Cuemanco.',
            },
        })

        // Seed de Favorito de prueba para turista@test.com
        const favoritoSeed = await prisma.favorito.upsert({
            where: {
                userId_experienciaId: {
                    userId: turistaUser.id,
                    experienciaId: 'seed-exp-xochimilco-1',
                },
            },
            update: {},
            create: {
                userId: turistaUser.id,
                experienciaId: 'seed-exp-xochimilco-1',
            },
        })

        console.log({ reservaSeed, favoritoSeed })
    }
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
