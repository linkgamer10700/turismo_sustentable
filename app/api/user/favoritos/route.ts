import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ToggleFavoritoSchema } from "@/lib/validations/reserva";

/**
 * GET /api/user/favoritos
 * Returns the list of experiences saved as favorites/itinerary for the authenticated user.
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado. Inicie sesión para ver sus favoritos.",
        },
        { status: 401 }
      );
    }

    const favoritos = await prisma.favorito.findMany({
      where: { userId: session.user.id },
      include: {
        experiencia: {
          include: {
            proveedor: {
              select: {
                id: true,
                nombreNegocio: true,
                alcaldiaCDMX: true,
                estadoValidacion: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: favoritos.length,
      favoritos,
    });
  } catch (error) {
    console.error("[FAVORITOS_GET_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al obtener los favoritos.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/favoritos
 * Toggles an experience in user's saved favorites/itinerary list.
 * If already favorited, deletes it; otherwise creates it.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado. Inicie sesión para gestionar sus favoritos.",
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const validation = ToggleFavoritoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          detalles: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { experienciaId } = validation.data;

    // Verify experience exists
    const experiencia = await prisma.experiencia.findUnique({
      where: { id: experienciaId },
      select: { id: true, titulo: true, activo: true },
    });

    if (!experiencia || !experiencia.activo) {
      return NextResponse.json(
        {
          success: false,
          error: "La experiencia no existe o no se encuentra activa.",
        },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorito = await prisma.favorito.findUnique({
      where: {
        userId_experienciaId: {
          userId: session.user.id,
          experienciaId,
        },
      },
    });

    if (existingFavorito) {
      await prisma.favorito.delete({
        where: { id: existingFavorito.id },
      });

      return NextResponse.json({
        success: true,
        isFavorito: false,
        message: "Experiencia retirada de tus favoritos.",
      });
    }

    const nuevoFavorito = await prisma.favorito.create({
      data: {
        userId: session.user.id,
        experienciaId,
      },
      include: {
        experiencia: {
          select: {
            id: true,
            titulo: true,
            categoria: true,
            alcaldiaCDMX: true,
            precio: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        isFavorito: true,
        message: "Experiencia guardada en tus favoritos e itinerario.",
        favorito: nuevoFavorito,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[FAVORITOS_POST_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al actualizar favoritos.",
      },
      { status: 500 }
    );
  }
}
