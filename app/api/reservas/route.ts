import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  CrearReservaSchema,
  FiltroReservasSchema,
} from "@/lib/validations/reserva";
import { EstadoReserva, Rol } from "@prisma/client";

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

/**
 * POST /api/reservas
 * Creates a sustainable experience reservation with strict ecological carrying capacity validation.
 * Uses an atomic transaction to prevent overbooking beyond environmental limits.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado. Inicie sesión para reservar experiencias.",
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const validation = CrearReservaSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos de reserva inválidos",
          detalles: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { experienciaId, fecha, numeroPersonas, notasEspeciales } =
      validation.data;

    // Normalize date to UTC midnight for consistent DATE column matching
    const rawDate = new Date(fecha);
    const yyyy = rawDate.getUTCFullYear();
    const mm = String(rawDate.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(rawDate.getUTCDate()).padStart(2, "0");
    const activityDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);

    // Execute within a serializable/atomic transaction to prevent race conditions on capacity
    const nuevaReserva = await prisma.$transaction(async (tx) => {
      // 1. Fetch experience to check status, pricing, and carrying capacity
      const experiencia = await tx.experiencia.findUnique({
        where: { id: experienciaId },
        select: {
          id: true,
          titulo: true,
          precio: true,
          capacidadCarga: true,
          activo: true,
          alcaldiaCDMX: true,
        },
      });

      if (!experiencia || !experiencia.activo) {
        throw new Error("NOT_FOUND_OR_INACTIVE");
      }

      // 2. Sum existing reserved spots for this experience on the target date
      const reservasExistentes = await tx.reserva.aggregate({
        _sum: { numeroPersonas: true },
        where: {
          experienciaId,
          fecha: activityDate,
          estado: {
            in: [EstadoReserva.CONFIRMADA, EstadoReserva.PENDIENTE_PAGO],
          },
        },
      });

      const personasReservadas = reservasExistentes._sum.numeroPersonas || 0;
      const capacidadMaxima = experiencia.capacidadCarga;
      const cuposDisponibles = Math.max(0, capacidadMaxima - personasReservadas);

      // 3. Ecological carrying capacity validation
      if (personasReservadas + numeroPersonas > capacidadMaxima) {
        throw new ConflictError(
          `Capacidad de carga ecológica excedida para esta fecha. Quedan únicamente ${cuposDisponibles} lugares disponibles para evitar impacto ambiental.`
        );
      }

      // 4. Calculate total price and unique voucher code
      const unitPrice = Number(experiencia.precio);
      const precioTotal = unitPrice * numeroPersonas;
      const dateSegment = `${yyyy}${mm}${dd}`;
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const codigoComprobante = `ECO-${dateSegment}-${randomSuffix}`;

      // 5. Create reservation record
      return await tx.reserva.create({
        data: {
          userId: session.user.id,
          experienciaId,
          fecha: activityDate,
          numeroPersonas,
          precioTotal,
          estado: EstadoReserva.CONFIRMADA,
          codigoComprobante,
          notasEspeciales: notasEspeciales || null,
        },
        include: {
          experiencia: {
            select: {
              id: true,
              titulo: true,
              categoria: true,
              alcaldiaCDMX: true,
              ubicacionDetallada: true,
              precio: true,
              duracionMinutos: true,
              capacidadCarga: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Reserva confirmada con éxito. ¡Gracias por apoyar el turismo sustentable en la CDMX!",
        reserva: nuevaReserva,
        comprobante: {
          codigo: nuevaReserva.codigoComprobante,
          titular: session.user.name || session.user.email,
          experiencia: nuevaReserva.experiencia.titulo,
          fecha: nuevaReserva.fecha,
          numeroPersonas: nuevaReserva.numeroPersonas,
          precioTotal: nuevaReserva.precioTotal,
          alcaldia: nuevaReserva.experiencia.alcaldiaCDMX,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof ConflictError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          capacidadExcedida: true,
        },
        { status: 409 }
      );
    }

    if (error.message === "NOT_FOUND_OR_INACTIVE") {
      return NextResponse.json(
        {
          success: false,
          error: "La experiencia solicitada no existe o no se encuentra activa.",
        },
        { status: 404 }
      );
    }

    console.error("[RESERVAS_POST_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al procesar la reserva sustentable.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reservas
 * Role-based listing of reservations:
 * - TURISTA: Returns personal bookings with experience details.
 * - PROVEEDOR: Returns reservations for all business experiences.
 * - ADMINISTRADOR: Returns global list with key platform sustainability metrics.
 */
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado. Inicie sesión para consultar reservas.",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const estadoParam = searchParams.get("estado") || undefined;
    const filterResult = FiltroReservasSchema.safeParse({ estado: estadoParam });

    const estadoFiltro = filterResult.success ? filterResult.data.estado : undefined;
    const userRole = session.user.rol as Rol;

    // TURISTA: Ver únicamente sus reservas
    if (userRole === Rol.TURISTA) {
      const reservas = await prisma.reserva.findMany({
        where: {
          userId: session.user.id,
          ...(estadoFiltro ? { estado: estadoFiltro } : {}),
        },
        include: {
          experiencia: {
            include: {
              proveedor: {
                select: {
                  nombreNegocio: true,
                  alcaldiaCDMX: true,
                },
              },
            },
          },
        },
        orderBy: { fecha: "asc" },
      });

      return NextResponse.json({
        success: true,
        rol: userRole,
        count: reservas.length,
        reservas,
      });
    }

    // PROVEEDOR: Ver reservas de sus experiencias
    if (userRole === Rol.PROVEEDOR) {
      const reservas = await prisma.reserva.findMany({
        where: {
          experiencia: {
            proveedor: {
              userId: session.user.id,
            },
          },
          ...(estadoFiltro ? { estado: estadoFiltro } : {}),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          experiencia: true,
        },
        orderBy: { fecha: "asc" },
      });

      return NextResponse.json({
        success: true,
        rol: userRole,
        count: reservas.length,
        reservas,
      });
    }

    // ADMINISTRADOR: Lista general y métricas de impacto
    if (userRole === Rol.ADMINISTRADOR) {
      const [reservas, metricas] = await Promise.all([
        prisma.reserva.findMany({
          where: {
            ...(estadoFiltro ? { estado: estadoFiltro } : {}),
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            experiencia: {
              include: {
                proveedor: {
                  select: {
                    nombreNegocio: true,
                    alcaldiaCDMX: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.reserva.aggregate({
          _count: { id: true },
          _sum: {
            numeroPersonas: true,
            precioTotal: true,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        rol: userRole,
        metricas: {
          totalReservas: metricas._count.id || 0,
          totalPersonas: metricas._sum.numeroPersonas || 0,
          totalIngresos: metricas._sum.precioTotal || 0,
        },
        count: reservas.length,
        reservas,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Rol no reconocido para consulta de reservas.",
      },
      { status: 403 }
    );
  } catch (error) {
    console.error("[RESERVAS_GET_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al recuperar las reservas.",
      },
      { status: 500 }
    );
  }
}
