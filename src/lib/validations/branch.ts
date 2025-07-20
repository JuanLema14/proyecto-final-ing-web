import { z } from "zod"

export const branchFormSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  address: z.string().min(5, "La dirección es obligatoria"),
  phone: z.string().min(7, "Teléfono inválido"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  schedule: z.object({
    lunes: z.string().min(1, "Horario requerido"),
    martes: z.string().min(1, "Horario requerido"),
    miercoles: z.string().min(1, "Horario requerido"),
    jueves: z.string().min(1, "Horario requerido"),
    viernes: z.string().min(1, "Horario requerido"),
    sabado: z.string().min(1, "Horario requerido"),
    domingo: z.string().min(1, "Horario requerido"),
  }),
  isActive: z.boolean(),
});