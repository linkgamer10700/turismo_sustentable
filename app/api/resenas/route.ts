import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lugar = searchParams.get("lugar")?.toLowerCase();

    const whereClause: { lugarSlug?: string } = {};
    if (lugar) {
      whereClause.lugarSlug = lugar;
    }

    const resenas = await prisma.resena.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    const total = resenas.length;
    let promedio = 5.0;
    const conteoEstrellas: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const fotosColectadas: string[] = [];

    if (total > 0) {
      const suma = resenas.reduce((acc, r) => {
        const cal = Math.min(5, Math.max(1, r.calificacion));
        conteoEstrellas[cal] = (conteoEstrellas[cal] || 0) + 1;
        if (Array.isArray(r.fotos)) {
          for (const f of r.fotos as string[]) {
            if (typeof f === "string" && f.startsWith("http")) {
              fotosColectadas.push(f);
            }
          }
        }
        return acc + cal;
      }, 0);
      promedio = Number((suma / total).toFixed(1));
    }

    const desgloseBarras = [5, 4, 3, 2, 1].map((s) => ({
      estrellas: s,
      cantidad: conteoEstrellas[s] || 0,
      porcentaje: total > 0 ? Math.round(((conteoEstrellas[s] || 0) / total) * 100) : 0,
    }));

    return NextResponse.json({
      success: true,
      total,
      promedio,
      desgloseBarras,
      fotos: fotosColectadas.slice(0, 10),
      resenas,
    });
  } catch (error) {
    console.error("[RESENAS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener las reseñas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Inicia sesión para publicar tu reseña." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const { lugarSlug, calificacion, comentario, fotos } = body || {};

    if (!lugarSlug || typeof lugarSlug !== "string") {
      return NextResponse.json(
        { success: false, error: "El lugar o destino es obligatorio." },
        { status: 400 }
      );
    }

    const numCalificacion = Number(calificacion);
    if (!numCalificacion || numCalificacion < 1 || numCalificacion > 5) {
      return NextResponse.json(
        { success: false, error: "La calificación debe ser entre 1 y 5 estrellas." },
        { status: 400 }
      );
    }

    if (!comentario || typeof comentario !== "string" || comentario.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "El comentario debe tener al menos 5 caracteres." },
        { status: 400 }
      );
    }

    const autorNombre = session.user.name || "Turista Responsable";

    const nuevaResena = await prisma.resena.create({
      data: {
        userId: session.user.id,
        autorNombre,
        lugarSlug: lugarSlug.toLowerCase(),
        calificacion: Math.round(numCalificacion),
        comentario: comentario.trim(),
        fotos: Array.isArray(fotos) ? fotos : [],
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "¡Reseña publicada con éxito!",
        data: nuevaResena,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[RESENAS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar la reseña." },
      { status: 500 }
    );
  }
}

