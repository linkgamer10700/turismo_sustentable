import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/lib/zod"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

// Notice this is only an object, not a full Auth.js instance
export default {
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await prisma.usuarios.findUnique({
            where: { email: email }
          })

          if (!user || !user.password_hash) return null

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password_hash
          )

          if (passwordsMatch) return user as any
        }

        return null
      }
    })
  ],
} satisfies NextAuthConfig