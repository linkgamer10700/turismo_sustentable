import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { RegisterSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
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

    const validation = RegisterSchema.safeParse(body);

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

    const {
      name,
      email,
      password,
      rol,
      preferencias,
      theme,
      nombreNegocio,
      descripcionBreve,
      categoria,
      alcaldiaCDMX,
    } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is already registered.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          rol,
          theme,
          preferencias: preferencias ?? undefined,
        },
      });

      if (rol === "PROVEEDOR") {
        await tx.proveedor.create({
          data: {
            userId: user.id,
            nombreNegocio: nombreNegocio || name,
            descripcionBreve: descripcionBreve || null,
            categoria: categoria || null,
            alcaldiaCDMX: alcaldiaCDMX || null,
            estadoValidacion: "PENDIENTE",
          },
        });
      }

      return tx.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          rol: true,
          idioma: true,
          theme: true,
          preferencias: true,
          fechaRegistro: true,
          proveedor: {
            select: {
              id: true,
              nombreNegocio: true,
              descripcionBreve: true,
              categoria: true,
              alcaldiaCDMX: true,
              estadoValidacion: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "User successfully registered.",
        data: createdUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during registration.",
      },
      { status: 500 }
    );
  }
}
