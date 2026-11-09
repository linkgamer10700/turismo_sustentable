import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UpdatePreferencesSchema } from "@/lib/validations/auth";
import { Prisma, ThemePreference } from "@prisma/client";

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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error fetching profile.",
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

    const validation = UpdatePreferencesSchema.safeParse(body);

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

    const { idioma, theme, preferencias } = validation.data;

    const updateData: Prisma.UserUpdateInput = {};

    if (idioma !== undefined) {
      updateData.idioma = idioma;
    }

    if (theme !== undefined) {
      updateData.theme = theme as ThemePreference;
    }

    if (preferencias !== undefined) {
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { preferencias: true },
      });

      const currentPreferences =
        currentUser?.preferencias && typeof currentUser.preferencias === "object" && !Array.isArray(currentUser.preferencias)
          ? (currentUser.preferencias as Record<string, unknown>)
          : {};

      updateData.preferencias = {
        ...currentPreferences,
        ...preferencias,
      } as Prisma.InputJsonValue;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      message: "Profile preferences updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("[PROFILE_PATCH_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error updating profile preferences.",
      },
      { status: 500 }
    );
  }
}
