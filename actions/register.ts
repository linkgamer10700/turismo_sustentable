"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/zod";

export const register = async (values: z.infer<typeof registerSchema>) => {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" };
    }

    const { email, password, name, phone } = validatedFields.data;

    const existingUser = await prisma.usuario.findUnique({
        where: {
            correo: email,
        },
    });

    if (existingUser) {
        return { error: "El correo ya está en uso!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role assignment - assuming you have a way to determine default role ID
    // For now, we'll need to fetch a default role or handle it. 
    // Let's assume there's a 'USER' role or similar. 
    // Since we don't know the role IDs, we might need to query them first or hardcode if known.
    // For safety, let's try to find a 'Usuario' role or create one if it doesn't exist? 
    // Or better, just fail if no role found for now, or use a placeholder.

    // Fetch 'Usuario' role
    const userRole = await prisma.rol.findUnique({ where: { nombre: "Usuario" } });

    if (!userRole) {
        return { error: "Error interno: Rol 'Usuario' no encontrado." };
    }

    await prisma.usuario.create({
        data: {
            nombre: name,
            correo: email,
            contrasena: hashedPassword,
            telefono: phone,
            rolId: userRole.id,
        },
    });

    return { success: "Cuenta creada exitosamente!" };
};
