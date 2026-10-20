import { z } from "zod";

export const TipoDocumentoEnum = [
  "CERTIFICACION_ECOLOGICA",
  "MANEJO_RESIDUOS",
  "USO_AGUA_ENERGIA",
  "IMPACTO_COMUNITARIO",
  "OTRO",
] as const;

export const SubirEvidenciaSchema = z.object({
  tipo: z.enum(TipoDocumentoEnum, {
    message: "Tipo de documento no válido.",
  }),
  titulo: z
    .string()
    .trim()
    .min(3, { message: "El título debe tener al menos 3 caracteres." }),
  descripcion: z
    .string()
    .trim()
    .max(500, { message: "La descripción no puede exceder los 500 caracteres." })
    .optional(),
  archivoUrl: z
    .string()
    .trim()
    .min(1, { message: "La URL o ruta del archivo es obligatoria." }),
});

export const DictamenEvidenciaSchema = z
  .object({
    documentoId: z
      .string()
      .trim()
      .min(1, { message: "El ID del documento es obligatorio." }),
    estado: z.enum(["APROBADO", "RECHAZADO"], {
      message: "El estado debe ser APROBADO o RECHAZADO.",
    }),
    retroalimentacion: z
      .string()
      .trim()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.estado === "RECHAZADO") {
        return !!data.retroalimentacion && data.retroalimentacion.trim().length > 0;
      }
      return true;
    },
    {
      message: "La retroalimentación es obligatoria cuando el documento es RECHAZADO.",
      path: ["retroalimentacion"],
    }
  );

export type SubirEvidenciaInput = z.infer<typeof SubirEvidenciaSchema>;
export type DictamenEvidenciaInput = z.infer<typeof DictamenEvidenciaSchema>;
