import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  CrearExperienciaSchema,
  FiltroExperienciasSchema,
} from "@/lib/validations/experiencia";
import { Rol, EstadoValidacion, Prisma } from "@prisma/client";

/**
 * GET /api/experiencias
 * Catálogo público de experiencias sustentables en la CDMX con filtros dinámicos.
 * Solo muestra experiencias activas de proveedores con estadoValidacion === APROBADO.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const queryParams = {
      alcaldia: searchParams.get("alcaldia") || undefined,
      categoria: searchParams.get("categoria") || undefined,
      precioMax: searchParams.get("precioMax") || undefined,
      duracionMaxMinutos: searchParams.get("duracionMaxMinutos") || undefined,
      buscar: searchParams.get("buscar") || undefined,
    };

    const filterResult = FiltroExperienciasSchema.safeParse(queryParams);

    if (!filterResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Parámetros de búsqueda inválidos",
          detalles: filterResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { alcaldia, categoria, precioMax, duracionMaxMinutos, buscar } =
      filterResult.data;

    // Filtro base: activo y proveedor aprobado
    const where: Prisma.ExperienciaWhereInput = {
      activo: true,
      proveedor: {
        estadoValidacion: EstadoValidacion.APROBADO,
      },
    };

    if (alcaldia) {
      where.alcaldiaCDMX = alcaldia;
    }

    if (categoria) {
      where.categoria = categoria;
    }

    if (precioMax !== undefined) {
      where.precio = {
        lte: precioMax,
      };
    }

    if (duracionMaxMinutos !== undefined) {
      where.duracionMinutos = {
        lte: duracionMaxMinutos,
      };
    }

    if (buscar && buscar.trim() !== "") {
      const term = buscar.trim();
      where.OR = [
        { titulo: { contains: term } },
        { descripcion: { contains: term } },
        { ubicacionDetallada: { contains: term } },
        { categoria: { contains: term } },
      ];
    }

    const experiencias = await prisma.experiencia.findMany({
      where,
      include: {
        proveedor: {
          select: {
            id: true,
            nombreNegocio: true,
            alcaldiaCDMX: true,
            categoria: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: experiencias,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[GET_EXPERIENCIAS_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al consultar el catálogo de experiencias.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/experiencias
 * Creación de una nueva experiencia sustentable por parte de un Proveedor Aprobado.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado. Debes iniciar sesión.",
        },
        { status: 401 }
      );
    }

    if (session.user.rol !== Rol.PROVEEDOR) {
      return NextResponse.json(
        {
          success: false,
          error: "Acceso denegado. Solo usuarios con rol PROVEEDOR pueden dar de alta experiencias.",
        },
        { status: 403 }
      );
    }

    // Buscar entidad Proveedor asociada al usuario
    const proveedor = await prisma.proveedor.findUnique({
      where: { userId: session.user.id },
    });

    if (!proveedor) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró el registro de proveedor asociado a tu cuenta.",
        },
        { status: 404 }
      );
    }

    // Regla de negocio crítica (RF4 / RNF2): Validación ecológica previa
    if (proveedor.estadoValidacion !== EstadoValidacion.APROBADO) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No puedes publicar experiencias hasta que tus evidencias ecológicas hayan sido aprobadas por un administrador.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = CrearExperienciaSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos de experiencia inválidos",
          detalles: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    const nuevaExperiencia = await prisma.experiencia.create({
      data: {
        proveedorId: proveedor.id,
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoria: data.categoria,
        alcaldiaCDMX: data.alcaldiaCDMX,
        ubicacionDetallada: data.ubicacionDetallada || null,
        precio: data.precio,
        duracionMinutos: data.duracionMinutos,
        capacidadCarga: data.capacidadCarga,
        imagenes: data.imagenes,
        activo: true,
      },
      include: {
        proveedor: {
          select: {
            id: true,
            nombreNegocio: true,
            alcaldiaCDMX: true,
            categoria: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: nuevaExperiencia,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST_EXPERIENCIAS_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al crear la experiencia sustentable.",
      },
      { status: 500 }
    );
  }
}
