import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/lib/zod"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await prisma.usuario.findUnique({
            where: { correo: email }
          })

          if (!user || !user.contrasena) return null

          const passwordsMatch = await bcrypt.compare(
            password,
            user.contrasena
          )

          if (passwordsMatch) return user
        }

        return null
      }
    })
  ],
} satisfies NextAuthConfig