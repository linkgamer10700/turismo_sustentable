import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/experiencias/[id]
 * Consulta individual de una experiencia con la información completa de su proveedor.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID de experiencia requerido",
        },
        { status: 400 }
      );
    }

    const experiencia = await prisma.experiencia.findUnique({
      where: { id },
      include: {
        proveedor: {
          select: {
            id: true,
            nombreNegocio: true,
            descripcionBreve: true,
            alcaldiaCDMX: true,
            categoria: true,
            estadoValidacion: true,
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!experiencia || !experiencia.activo) {
      return NextResponse.json(
        {
          success: false,
          error: "Experiencia no encontrada o no disponible",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: experiencia,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[GET_EXPERIENCIA_BY_ID_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al consultar el detalle de la experiencia.",
      },
      { status: 500 }
    );
  }
}
