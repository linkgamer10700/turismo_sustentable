import { Rol, ThemePreference } from "@prisma/client";
import { type DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    rol?: Rol;
    theme?: ThemePreference;
    idioma?: string;
  }

  interface Session {
    user: {
      id: string;
      rol: Rol;
      theme: ThemePreference;
      idioma: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    rol?: Rol;
    theme?: ThemePreference;
    idioma?: string;
  }
}
