"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { RegisterSchema, type RegisterInput } from "@/lib/validations/auth";

export const register = async (values: RegisterInput | Record<string, unknown>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Campos inválidos",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    email,
    password,
    name,
    rol = "TURISTA",
    theme = "SYSTEM",
    preferencias,
    nombreNegocio,
    descripcionBreve,
    categoria,
    alcaldiaCDMX,
  } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return { error: "El correo ya está en uso!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
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
            },
          },
        },
      });
    });

    return {
      success: "Cuenta creada exitosamente!",
      data: createdUser,
    };
  } catch (error) {
    console.error("[REGISTER_ACTION_ERROR]", error);
    return { error: "Error en el servidor al registrar el usuario" };
  }
};
