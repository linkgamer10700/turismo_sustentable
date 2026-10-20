"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LoginSchema, type LoginInput } from "@/lib/validations/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Rol } from "@prisma/client";

/**
 * Determines redirect destination based on user role
 */
export async function getRedirectPathByRole(role?: string | Rol | null): Promise<string> {
  switch (role) {
    case "ADMINISTRADOR":
    case Rol.ADMINISTRADOR:
      return "/admin/dashboard";
    case "PROVEEDOR":
    case Rol.PROVEEDOR:
      return "/negocio/dashboard";
    case "TURISTA":
    case Rol.TURISTA:
    default:
      return "/dashboard";
  }
}

/**
 * Unified login action
 */
export const login = async (values: LoginInput | { email: string; password: string }) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { email, password } = validatedFields.data;

  try {
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, rol: true, passwordHash: true },
      });
    } catch (dbError) {
      console.error("[LOGIN_DB_ERROR]", dbError);
      return {
        error: "No se pudo conectar a la base de datos. Asegúrate de que MySQL / Docker esté corriendo.",
      };
    }

    if (!existingUser || !existingUser.passwordHash) {
      return { error: "Credenciales inválidas!" };
    }

    const passwordsMatch = await bcrypt.compare(password, existingUser.passwordHash);
    if (!passwordsMatch) {
      return { error: "Credenciales inválidas!" };
    }

    const redirectTo = await getRedirectPathByRole(existingUser.rol);

    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });

    return { success: true, redirectTo, role: existingUser.rol };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas!" };
        default:
          return { error: "Algo salió mal al iniciar sesión!" };
      }
    }
    throw error;
  }
};

export const loginAdmin = async (values: LoginInput | { email: string; password: string }) => {
  return login(values);
};

export const loginNegocio = async (values: LoginInput | { email: string; password: string }) => {
  return login(values);
};
