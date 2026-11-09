import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import authConfig from "./auth.config";
import { Rol, ThemePreference } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
        token.theme = user.theme;
        token.idioma = user.idioma;
      }

      if (trigger === "update" && session) {
        if (session.theme) token.theme = session.theme;
        if (session.idioma) token.idioma = session.idioma;
        if (session.name) token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        if (token.rol) session.user.rol = token.rol as Rol;
        if (token.theme) session.user.theme = token.theme as ThemePreference;
        if (token.idioma) session.user.idioma = token.idioma as string;
      }
      return session;
    },
  },
});