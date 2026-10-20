import { z } from "zod";
import { EstadoReserva } from "@prisma/client";

/**
 * Validation schema for creating a new reservation.
 * Enforces positive person count and present or future dates.
 */
export const CrearReservaSchema = z.object({
  experienciaId: z
    .string()
    .trim()
    .min(1, { message: "El ID de la experiencia es obligatorio" }),
  fecha: z
    .string()
    .trim()
    .refine(
      (val) => {
        const parsed = new Date(val);
        if (isNaN(parsed.getTime())) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(val);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate >= today;
      },
      { message: "La fecha de la reserva debe ser válida y estar en tiempo presente o futuro" }
    ),
  numeroPersonas: z.coerce
    .number()
    .int({ message: "El número de personas debe ser un número entero" })
    .min(1, { message: "Debe reservar para al menos 1 persona" })
    .max(100, { message: "El número de personas excede el límite permitido por reserva" }),
  notasEspeciales: z
    .string()
    .trim()
    .max(300, { message: "Las notas especiales no pueden exceder los 300 caracteres" })
    .optional()
    .or(z.literal("")),
});

export type CrearReservaInput = z.infer<typeof CrearReservaSchema>;

/**
 * Filter schema for query parameters when listing reservations.
 */
export const FiltroReservasSchema = z.object({
  estado: z.nativeEnum(EstadoReserva).optional(),
});

export type FiltroReservasInput = z.infer<typeof FiltroReservasSchema>;

/**
 * Validation schema for toggling an experience in favorites.
 */
export const ToggleFavoritoSchema = z.object({
  experienciaId: z
    .string()
    .trim()
    .min(1, { message: "El ID de la experiencia es obligatorio" }),
});

export type ToggleFavoritoInput = z.infer<typeof ToggleFavoritoSchema>;
