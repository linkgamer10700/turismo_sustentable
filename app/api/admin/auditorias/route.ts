import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { DictamenEvidenciaSchema } from "@/lib/validations/sustentabilidad";
import { EstadoValidacion } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. An active session is required.",
        },
        { status: 401 }
      );
    }

    if (session.user.rol !== "ADMINISTRADOR") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden. Access restricted to platform administrators.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const estadoQuery = searchParams.get("estado")?.toUpperCase();

    const whereClause: {
      estadoValidacion?: EstadoValidacion;
    } = {};

    if (
      estadoQuery &&
      Object.values(EstadoValidacion).includes(estadoQuery as EstadoValidacion)
    ) {
      whereClause.estadoValidacion = estadoQuery as EstadoValidacion;
    }

    const auditorias = await prisma.proveedor.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            fechaRegistro: true,
          },
        },
        documentos: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: auditorias,
    });
  } catch (error) {
    console.error("[ADMIN_AUDITORIAS_GET_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error fetching audits.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. An active session is required.",
        },
        { status: 401 }
      );
    }

    if (session.user.rol !== "ADMINISTRADOR") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden. Access restricted to platform administrators.",
        },
        { status: 403 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON payload in request body.",
        },
        { status: 400 }
      );
    }

    const validation = DictamenEvidenciaSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { documentoId, estado, retroalimentacion } = validation.data;

    const documentoExistente = await prisma.documentoEvidencia.findUnique({
      where: { id: documentoId },
      include: { proveedor: true },
    });

    if (!documentoExistente) {
      return NextResponse.json(
        {
          success: false,
          error: "Document not found.",
        },
        { status: 404 }
      );
    }

    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el estado y retroalimentación del documento
      const docActualizado = await tx.documentoEvidencia.update({
        where: { id: documentoId },
        data: {
          estado: estado as EstadoValidacion,
          retroalimentacionAdmin: retroalimentacion || null,
        },
      });

      let proveedorActualizado = documentoExistente.proveedor;

      // 2. Lógica transaccional de negocio según el dictamen:
      if (estado === "RECHAZADO") {
        // Si se rechaza la evidencia, el proveedor pasa a RECHAZADO
        proveedorActualizado = await tx.proveedor.update({
          where: { id: documentoExistente.proveedorId },
          data: { estadoValidacion: "RECHAZADO" },
        });
      } else if (estado === "APROBADO") {
        // Si se aprueba, revisar si todos los documentos del proveedor están aprobados
        const todosLosDocs = await tx.documentoEvidencia.findMany({
          where: { proveedorId: documentoExistente.proveedorId },
        });

        const hayPendienteORechazado = todosLosDocs.some(
          (d) => d.id !== documentoId && d.estado !== "APROBADO"
        );

        if (!hayPendienteORechazado) {
          proveedorActualizado = await tx.proveedor.update({
            where: { id: documentoExistente.proveedorId },
            data: { estadoValidacion: "APROBADO" },
          });
        }
      }

      return {
        documento: docActualizado,
        proveedor: proveedorActualizado,
      };
    });

    return NextResponse.json({
      success: true,
      message: `Evidencia dictaminada como ${estado} exitosamente.`,
      data: resultado,
    });
  } catch (error) {
    console.error("[ADMIN_AUDITORIAS_PATCH_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error applying evidence dictamen.",
      },
      { status: 500 }
    );
  }
}
