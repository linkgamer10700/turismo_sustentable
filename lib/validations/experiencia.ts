import { z } from "zod";

/**
 * Listado oficial e inmutable de las 16 alcaldías de la Ciudad de México
 */
export const ALCALDIAS_CDMX = [
  "Álvaro Obregón",
  "Azcapotzalco",
  "Benito Juárez",
  "Coyoacán",
  "Cuajimalpa de Morelos",
  "Cuauhtémoc",
  "Gustavo A. Madero",
  "Iztacalco",
  "Iztapalapa",
  "La Magdalena Contreras",
  "Miguel Hidalgo",
  "Milpa Alta",
  "Tláhuac",
  "Tlalpan",
  "Venustiano Carranza",
  "Xochimilco",
] as const;

export type AlcaldiaCDMX = (typeof ALCALDIAS_CDMX)[number];

/**
 * Esquema de validación para la creación de experiencias sustentables
 */
export const CrearExperienciaSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(5, { message: "El título debe tener al menos 5 caracteres" })
    .max(180, { message: "El título no puede exceder 180 caracteres" }),
  descripcion: z
    .string()
    .trim()
    .min(20, { message: "La descripción debe tener al menos 20 caracteres" }),
  categoria: z
    .string()
    .trim()
    .min(3, { message: "La categoría debe tener al menos 3 caracteres" }),
  alcaldiaCDMX: z.enum(ALCALDIAS_CDMX, {
    message: "La actividad debe ubicarse estrictamente en una alcaldía de la CDMX",
  }),
  ubicacionDetallada: z
    .string()
    .trim()
    .max(255, { message: "La ubicación detallada no puede superar los 255 caracteres" })
    .optional()
    .or(z.literal("")),
  precio: z.coerce
    .number()
    .min(0, { message: "El precio debe ser positivo o cero" }),
  duracionMinutos: z.coerce
    .number()
    .int({ message: "La duración debe ser un número entero en minutos" })
    .min(15, { message: "La duración mínima es de 15 minutos" }),
  capacidadCarga: z.coerce
    .number()
    .int({ message: "La capacidad de carga debe ser un número entero" })
    .min(1, { message: "La capacidad mínima es de 1 persona" })
    .max(100, {
      message: "La capacidad máxima por grupo no debe exceder 100 personas para mitigar el impacto ambiental",
    }),
  imagenes: z
    .array(z.string().url({ message: "Cada imagen debe ser una URL válida" }))
    .optional()
    .default([]),
});

export type CrearExperienciaInput = z.infer<typeof CrearExperienciaSchema>;

/**
 * Esquema de validación para filtros en el catálogo de experiencias
 */
export const FiltroExperienciasSchema = z.object({
  alcaldia: z.string().optional(),
  categoria: z.string().optional(),
  precioMax: z.coerce
    .number()
    .min(0, { message: "El precio máximo debe ser positivo" })
    .optional(),
  duracionMaxMinutos: z.coerce
    .number()
    .int({ message: "La duración máxima debe ser un número entero" })
    .min(1, { message: "La duración máxima debe ser mayor a 0" })
    .optional(),
  buscar: z.string().optional(),
});

export type FiltroExperienciasInput = z.infer<typeof FiltroExperienciasSchema>;
