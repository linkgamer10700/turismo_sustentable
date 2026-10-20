import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { SubirEvidenciaSchema } from "@/lib/validations/sustentabilidad";

export async function GET() {
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

    if (session.user.rol !== "PROVEEDOR") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden. Access restricted to providers.",
        },
        { status: 403 }
      );
    }

    const proveedor = await prisma.proveedor.findUnique({
      where: { userId: session.user.id },
      include: {
        documentos: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!proveedor) {
      return NextResponse.json(
        {
          success: false,
          error: "Provider profile not found for this user account.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: proveedor,
    });
  } catch (error) {
    console.error("[PROVEEDOR_DOCS_GET_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error fetching provider documents.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    if (session.user.rol !== "PROVEEDOR") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden. Access restricted to providers.",
        },
        { status: 403 }
      );
    }

    const proveedor = await prisma.proveedor.findUnique({
      where: { userId: session.user.id },
    });

    if (!proveedor) {
      return NextResponse.json(
        {
          success: false,
          error: "Provider profile not found for this user account.",
        },
        { status: 404 }
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

    const validation = SubirEvidenciaSchema.safeParse(body);

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

    const { tipo, titulo, descripcion, archivoUrl } = validation.data;

    const nuevoDocumento = await prisma.$transaction(async (tx) => {
      const doc = await tx.documentoEvidencia.create({
        data: {
          proveedorId: proveedor.id,
          tipo,
          titulo,
          descripcion: descripcion || null,
          archivoUrl,
          estado: "PENDIENTE",
        },
      });

      // Si el proveedor estaba RECHAZADO, pasa a PENDIENTE para que los auditores revisen de nuevo
      if (proveedor.estadoValidacion === "RECHAZADO") {
        await tx.proveedor.update({
          where: { id: proveedor.id },
          data: { estadoValidacion: "PENDIENTE" },
        });
      }

      return doc;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Documento de evidencia registrado exitosamente.",
        data: nuevoDocumento,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[PROVEEDOR_DOCS_POST_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error registering provider document.",
      },
      { status: 500 }
    );
  }
}
