import { PrismaClient, Rol, EstadoReserva, EstadoValidacion, TipoDocumento } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // 1. Usuarios Base
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

  // Turistas para generar reservas reales
  const turista1 = await prisma.user.upsert({
    where: { email: 'turista@test.com' },
    update: {},
    create: {
      name: 'Sofía Valenzuela',
      email: 'turista@test.com',
      passwordHash: hashedPassword,
      rol: Rol.TURISTA,
      preferencias: {
        intereses: ['Naturaleza', 'Cultura', 'Ecoturismo'],
        estiloViaje: ['Bajo impacto', 'Al aire libre'],
      },
    },
  })

  const turista2 = await prisma.user.upsert({
    where: { email: 'carlos.mendoza@test.com' },
    update: {},
    create: {
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@test.com',
      passwordHash: hashedPassword,
      rol: Rol.TURISTA,
      preferencias: {
        intereses: ['Gastronomía', 'Comunidad'],
        estiloViaje: ['Accesible'],
      },
    },
  })

  const turista3 = await prisma.user.upsert({
    where: { email: 'mariana.rios@test.com' },
    update: {},
    create: {
      name: 'Mariana Ríos',
      email: 'mariana.rios@test.com',
      passwordHash: hashedPassword,
      rol: Rol.TURISTA,
      preferencias: {
        intereses: ['Aventura', 'Con mascotas'],
        estiloViaje: ['Al aire libre'],
      },
    },
  })

  // 2. Proveedores Diversificados
  const proveedoresData = [
    {
      email: 'negocio@test.com',
      userName: 'Alejandro Morales',
      nombreNegocio: 'Eco-Aventuras Los Andes',
      descripcionBreve: 'Rutas guiadas por biólogos locales en áreas de conservación de Xochimilco y Tlalpan.',
      categoria: 'Naturaleza',
      alcaldiaCDMX: 'Xochimilco',
      estadoValidacion: EstadoValidacion.PENDIENTE,
      documentos: [
        {
          id: 'doc-eco-1',
          tipo: TipoDocumento.CERTIFICACION_ECOLOGICA,
          titulo: 'Certificado de Cero Emisiones en Chinampas',
          descripcion: 'Constancia técnica expedida por la Comisión de Recursos Naturales y Desarrollo Rural.',
          archivoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
          estado: EstadoValidacion.PENDIENTE,
        },
        {
          id: 'doc-eco-2',
          tipo: TipoDocumento.MANEJO_RESIDUOS,
          titulo: 'Plan Comunitario de Manejo de Residuos Orgánicos',
          descripcion: 'Compostaje local y reutilización de materia vegetal en chinampas agroecológicas.',
          archivoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
          estado: EstadoValidacion.PENDIENTE,
        },
      ],
      experiencias: [
        {
          id: 'seed-exp-xochimilco-1',
          titulo: 'Ruta Ecoturística en Chinampas de Cuemanco',
          descripcion: 'Recorrido tradicional guiado en trajinera ecológica sin motor por los canales ancestrales de Cuemanco, promoviendo la agricultura sustentable de las chinampas y la conservación del ajolote.',
          categoria: 'Naturaleza',
          alcaldiaCDMX: 'Xochimilco',
          ubicacionDetallada: 'Embarcadero Cuemanco, Antiguo Canal 135',
          precio: 450.0,
          duracionMinutos: 180,
          capacidadCarga: 12,
          imagenes: ['https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80'],
        },
      ],
    },
    {
      email: 'sabor.chinampa@test.com',
      userName: 'Guadalupe Santos',
      nombreNegocio: 'Sabor Ancestral Chinampero',
      descripcionBreve: 'Gastronomía sustentable del campo a la mesa elaborada con maíces criollos y hortalizas limpias.',
      categoria: 'Comida',
      alcaldiaCDMX: 'Xochimilco',
      estadoValidacion: EstadoValidacion.PENDIENTE,
      documentos: [
        {
          id: 'doc-gast-1',
          tipo: TipoDocumento.IMPACTO_COMUNITARIO,
          titulo: 'Aval de Productores de Maíces Nativos CDMX',
          descripcion: 'Garantía de compra a precio justo a pequeños productores de San Gregorio Atlapulco.',
          archivoUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
          estado: EstadoValidacion.PENDIENTE,
        },
      ],
      experiencias: [
        {
          id: 'seed-exp-coyoacan-3',
          titulo: 'Taller de Gastronomía Prehispánica y Maíces Criollos',
          descripcion: 'Experiencia culinaria interactiva con ingredientes agroecológicos de productores del suelo de conservación, cocinados con técnicas tradicionales.',
          categoria: 'Comida',
          alcaldiaCDMX: 'Coyoacán',
          ubicacionDetallada: 'Centro Histórico de Coyoacán, Calle Francisco Sosa',
          precio: 650.0,
          duracionMinutos: 120,
          capacidadCarga: 10,
          imagenes: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
        },
      ],
    },
    {
      email: 'rutas.ajusco@test.com',
      userName: 'Rodrigo Vega',
      nombreNegocio: 'Caminatas Caninas del Ajusco',
      descripcionBreve: 'Paseos de senderismo de bajo impacto pet-friendly guiados por entrenadores y biólogos.',
      categoria: 'Con mascotas',
      alcaldiaCDMX: 'Tlalpan',
      estadoValidacion: EstadoValidacion.PENDIENTE,
      documentos: [
        {
          id: 'doc-pet-1',
          tipo: TipoDocumento.OTRO,
          titulo: 'Protocolo de Respeto a Fauna Silvestre y Manejo Canino',
          descripcion: 'Reglamento estricto para evitar alteración de ecosistemas forestales con animales domésticos.',
          archivoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
          estado: EstadoValidacion.PENDIENTE,
        },
      ],
      experiencias: [
        {
          id: 'seed-exp-ajusco-pet',
          titulo: 'Senderismo Responsable con Mascotas en el Ajusco',
          descripcion: 'Recorrido en senderos delimitados con hidratación ecológica y recolección biodegradable de desechos.',
          categoria: 'Con mascotas',
          alcaldiaCDMX: 'Tlalpan',
          ubicacionDetallada: 'Parque Nacional Cumbres del Ajusco, km 12',
          precio: 350.0,
          duracionMinutos: 150,
          capacidadCarga: 8,
          imagenes: ['https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'],
        },
      ],
    },
    {
      email: 'cultura.barro@test.com',
      userName: 'Patricia Gómez',
      nombreNegocio: 'Alfarería y Cultura de los Pueblos del Sur',
      descripcionBreve: 'Talleres tradicionales de rescate alfarero con pigmentos minerales no contaminantes.',
      categoria: 'Cultura',
      alcaldiaCDMX: 'Tláhuac',
      estadoValidacion: EstadoValidacion.APROBADO,
      documentos: [
        {
          id: 'doc-cult-1',
          tipo: TipoDocumento.IMPACTO_COMUNITARIO,
          titulo: 'Certificado de Preservación de Oficios Tradicionales',
          descripcion: 'Reconocimiento de la Secretaría de Cultura CDMX para turismo cultural regenerativo.',
          archivoUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
          estado: EstadoValidacion.APROBADO,
        },
      ],
      experiencias: [
        {
          id: 'seed-exp-tlahuac-barro',
          titulo: 'Taller de Cerámica y Pigmentos Naturales de Tláhuac',
          descripcion: 'Aprende las técnicas ancestrales de modelado con barro del humedal y pigmentos de flores locales.',
          categoria: 'Cultura',
          alcaldiaCDMX: 'Tláhuac',
          ubicacionDetallada: 'Barrio Santa Catarina, Tláhuac',
          precio: 400.0,
          duracionMinutos: 140,
          capacidadCarga: 15,
          imagenes: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'],
        },
      ],
    },
  ]

  for (const provData of proveedoresData) {
    const user = await prisma.user.upsert({
      where: { email: provData.email },
      update: {},
      create: {
        name: provData.userName,
        email: provData.email,
        passwordHash: hashedPassword,
        rol: Rol.PROVEEDOR,
      },
    })

    const proveedor = await prisma.proveedor.upsert({
      where: { userId: user.id },
      update: {
        nombreNegocio: provData.nombreNegocio,
        descripcionBreve: provData.descripcionBreve,
        categoria: provData.categoria,
        alcaldiaCDMX: provData.alcaldiaCDMX,
        estadoValidacion: provData.estadoValidacion,
      },
      create: {
        userId: user.id,
        nombreNegocio: provData.nombreNegocio,
        descripcionBreve: provData.descripcionBreve,
        categoria: provData.categoria,
        alcaldiaCDMX: provData.alcaldiaCDMX,
        estadoValidacion: provData.estadoValidacion,
      },
    })

    // Upsert Documentos de evidencia
    for (const doc of provData.documentos) {
      await prisma.documentoEvidencia.upsert({
        where: { id: doc.id },
        update: {
          estado: doc.estado,
          titulo: doc.titulo,
          descripcion: doc.descripcion,
          archivoUrl: doc.archivoUrl,
        },
        create: {
          id: doc.id,
          proveedorId: proveedor.id,
          tipo: doc.tipo,
          titulo: doc.titulo,
          descripcion: doc.descripcion,
          archivoUrl: doc.archivoUrl,
          estado: doc.estado,
        },
      })
    }

    // Upsert Experiencias
    for (const exp of provData.experiencias) {
      await prisma.experiencia.upsert({
        where: { id: exp.id },
        update: {
          titulo: exp.titulo,
          descripcion: exp.descripcion,
          categoria: exp.categoria,
          alcaldiaCDMX: exp.alcaldiaCDMX,
          precio: exp.precio,
          capacidadCarga: exp.capacidadCarga,
        },
        create: {
          id: exp.id,
          proveedorId: proveedor.id,
          titulo: exp.titulo,
          descripcion: exp.descripcion,
          categoria: exp.categoria,
          alcaldiaCDMX: exp.alcaldiaCDMX,
          ubicacionDetallada: exp.ubicacionDetallada,
          precio: exp.precio,
          duracionMinutos: exp.duracionMinutos,
          capacidadCarga: exp.capacidadCarga,
          imagenes: exp.imagenes,
          activo: true,
        },
      })
    }
  }

  // 3. Reservas Reales Diversificadas para Métricas BI
  const reservationsToCreate = [
    {
      id: 'res-seed-1',
      userId: turista1.id,
      expId: 'seed-exp-xochimilco-1',
      personas: 3,
      precio: 1350.0,
      code: 'ECO-202611-001',
    },
    {
      id: 'res-seed-2',
      userId: turista2.id,
      expId: 'seed-exp-xochimilco-1',
      personas: 2,
      precio: 900.0,
      code: 'ECO-202611-002',
    },
    {
      id: 'res-seed-3',
      userId: turista3.id,
      expId: 'seed-exp-xochimilco-1',
      personas: 4,
      precio: 1800.0,
      code: 'ECO-202611-003',
    },
    {
      id: 'res-seed-4',
      userId: turista1.id,
      expId: 'seed-exp-coyoacan-3',
      personas: 2,
      precio: 1300.0,
      code: 'ECO-202611-004',
    },
    {
      id: 'res-seed-5',
      userId: turista2.id,
      expId: 'seed-exp-coyoacan-3',
      personas: 3,
      precio: 1950.0,
      code: 'ECO-202611-005',
    },
    {
      id: 'res-seed-6',
      userId: turista3.id,
      expId: 'seed-exp-ajusco-pet',
      personas: 2,
      precio: 700.0,
      code: 'ECO-202611-006',
    },
    {
      id: 'res-seed-7',
      userId: turista1.id,
      expId: 'seed-exp-ajusco-pet',
      personas: 1,
      precio: 350.0,
      code: 'ECO-202611-007',
    },
    {
      id: 'res-seed-8',
      userId: turista2.id,
      expId: 'seed-exp-tlahuac-barro',
      personas: 4,
      precio: 1600.0,
      code: 'ECO-202611-008',
    },
    {
      id: 'res-seed-9',
      userId: turista3.id,
      expId: 'seed-exp-tlahuac-barro',
      personas: 2,
      precio: 800.0,
      code: 'ECO-202611-009',
    },
  ]

  const today = new Date()
  for (let i = 0; i < reservationsToCreate.length; i++) {
    const r = reservationsToCreate[i]
    const resDate = new Date(today)
    resDate.setDate(today.getDate() + (i % 7) + 1)

    await prisma.reserva.upsert({
      where: { codigoComprobante: r.code },
      update: {
        numeroPersonas: r.personas,
        precioTotal: r.precio,
      },
      create: {
        id: r.id,
        userId: r.userId,
        experienciaId: r.expId,
        fecha: resDate,
        numeroPersonas: r.personas,
        precioTotal: r.precio,
        estado: EstadoReserva.CONFIRMADA,
        codigoComprobante: r.code,
        notasEspeciales: `Reserva sustentable confirmada #${i + 1}`,
      },
    })
  }

  // 4. Reseñas Reales y Específicas por Lugar (Eliminación de datos genéricos)
  const resenasData = [
    {
      id: 'resena-cuemanco-1',
      userId: turista1.id,
      autorNombre: 'Sofía Valenzuela',
      lugarSlug: 'cuemanco',
      experienciaId: 'seed-exp-xochimilco-1',
      calificacion: 5,
      comentario: 'Increíble labor de conservación en los canales de Cuemanco. Ver los ajolotes en su hábitat chinampero y aprender de la agricultura sin agroquímicos cambió mi perspectiva del turismo en la CDMX.',
      fotos: [
        'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      ],
    },
    {
      id: 'resena-xochimilco-2',
      userId: turista2.id,
      autorNombre: 'Carlos Mendoza',
      lugarSlug: 'xochimilco',
      experienciaId: 'seed-exp-xochimilco-1',
      calificacion: 5,
      comentario: 'El recorrido en trajinera sin motor es súper tranquilo y respetuoso con las aves migratorias. El guía comunitario conoce cada rincón ancestral. Totalmente recomendable.',
      fotos: [
        'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=400&q=80',
      ],
    },
    {
      id: 'resena-xochimilco-3',
      userId: turista3.id,
      autorNombre: 'Mariana Ríos',
      lugarSlug: 'xochimilco',
      experienciaId: 'seed-exp-xochimilco-1',
      calificacion: 4,
      comentario: 'Excelente iniciativa comunitaria. Aprendimos a hacer composta con lirio acuático para nutrir la tierra de las chinampas. Se nota el compromiso contra el greenwashing.',
      fotos: [],
    },
    {
      id: 'resena-ajusco-1',
      userId: turista3.id,
      autorNombre: 'Mariana Ríos',
      lugarSlug: 'ajusco',
      experienciaId: 'seed-exp-ajusco-pet',
      calificacion: 5,
      comentario: 'Una experiencia inolvidable con nuestro perro en los senderos altos del Ajusco. El protocolo pet-friendly garantiza hidratación y evita que las mascotas perturben la anidación de aves.',
      fotos: [
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
      ],
    },
    {
      id: 'resena-tlalpan-1',
      userId: turista1.id,
      autorNombre: 'Sofía Valenzuela',
      lugarSlug: 'bosque-de-tlalpan',
      calificacion: 5,
      comentario: 'Caminata de conservación guiada por biólogos locales que conocen cada especie de encino y orquídea terrestre. Aire puro y respeto total por el área protegida.',
      fotos: [
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80',
      ],
    },
    {
      id: 'resena-coyoacan-1',
      userId: turista2.id,
      autorNombre: 'Carlos Mendoza',
      lugarSlug: 'coyoacan',
      experienciaId: 'seed-exp-coyoacan-3',
      calificacion: 5,
      comentario: 'El taller de maíces criollos y cocina tradicional fue una delicia. Degustamos tlacoyos y atoles preparados con cosechas agroecológicas traídas de Milpa Alta.',
      fotos: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      ],
    },
    {
      id: 'resena-tlahuac-1',
      userId: turista1.id,
      autorNombre: 'Sofía Valenzuela',
      lugarSlug: 'tlahuac',
      calificacion: 5,
      comentario: 'Modelar barro originario con tintes naturales de flores y cochinilla fue terapéutico. Un rescate cultural genuino de los pueblos originarios del sur.',
      fotos: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80',
      ],
    },
  ]

  for (const r of resenasData) {
    await prisma.resena.upsert({
      where: { id: r.id },
      update: {
        calificacion: r.calificacion,
        comentario: r.comentario,
        fotos: r.fotos,
      },
      create: {
        id: r.id,
        userId: r.userId,
        autorNombre: r.autorNombre,
        lugarSlug: r.lugarSlug,
        experienciaId: r.experienciaId || null,
        calificacion: r.calificacion,
        comentario: r.comentario,
        fotos: r.fotos,
      },
    })
  }

  console.log('Seed ejecutado exitosamente con proveedores, evidencias, reservas y reseñas reales.')
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
