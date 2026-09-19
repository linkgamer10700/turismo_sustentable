import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import { prisma as importedPrisma } from "./lib/db"

// Use the imported Prisma client to avoid multiple instances
const prisma = importedPrisma

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString() || ""
        token.name = (user as any).nombre || user.name
        token.email = (user as any).email || user.email
        token.role = (user as any).rol
      }
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
      }
      if (token.name && session.user) {
        session.user.name = token.name as string
      }
      if (token.email && session.user) {
        session.user.email = token.email as string
      }
      if (token.role && session.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  }
})