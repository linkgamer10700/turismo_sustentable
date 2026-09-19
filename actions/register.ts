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

    const existingUser = await prisma.usuarios.findUnique({
        where: {
            email: email,
        },
    });

    if (existingUser) {
        return { error: "El correo ya está en uso!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role assignment
    const userRole = "Turista";

    await prisma.usuarios.create({
        data: {
            nombre: name,
            email: email,
            password_hash: hashedPassword,
            rol: userRole,
            // telefono is not in the new schema, so it's omitted
        },
    });

    return { success: "Cuenta creada exitosamente!" };
};
