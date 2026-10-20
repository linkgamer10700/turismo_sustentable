import { z } from "zod";

export const UserInterestsEnum = [
  "Naturaleza",
  "Cultura",
  "Comunidad",
  "Gastronomía",
  "Aventura",
  "Historia",
] as const;

export const TravelStylesEnum = [
  "Accesible",
  "Bajo impacto",
  "Familiar",
  "Mochilero",
  "Ecológico",
] as const;

export const UserPreferencesSchema = z.object({
  intereses: z.array(z.string()).optional(),
  estiloViaje: z.array(z.string()).optional(),
});

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z
    .string()
    .trim()
    .email({ message: "Formato de correo electrónico no válido." })
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  rol: z
    .enum(["TURISTA", "PROVEEDOR"])
    .optional()
    .default("TURISTA"),
  preferencias: UserPreferencesSchema.optional(),
  theme: z
    .enum(["LIGHT", "DARK", "SYSTEM"])
    .optional()
    .default("SYSTEM"),
  // Optional provider fields initialized during registration if role is PROVEEDOR
  nombreNegocio: z.string().trim().min(2).optional(),
  descripcionBreve: z.string().trim().max(500).optional(),
  categoria: z.string().trim().optional(),
  alcaldiaCDMX: z.string().trim().optional(),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Formato de correo electrónico no válido." })
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: "La contraseña es requerida." }),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Formato de correo electrónico no válido." })
    .toLowerCase(),
});

export const UpdatePreferencesSchema = z.object({
  idioma: z
    .string()
    .trim()
    .min(2)
    .max(10)
    .optional(),
  theme: z
    .enum(["LIGHT", "DARK", "SYSTEM"])
    .optional(),
  preferencias: UserPreferencesSchema.optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type UpdatePreferencesInput = z.infer<typeof UpdatePreferencesSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
