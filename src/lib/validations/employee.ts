import z from "zod"

export const employeeFormSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z.string()
    .email("Debe ser un email válido")
    .max(100, "El email no puede exceder 100 caracteres"),
  phone: z.string()
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .optional(),
  position: z.string()
    .min(2, "El cargo debe tener al menos 2 caracteres")
    .max(100, "El cargo no puede exceder 100 caracteres"),
  salary: z.number()
    .min(0, "El salario no puede ser negativo")
    .max(999999999, "El salario no puede exceder 999,999,999"),
  branchId: z.string()
    .min(1, "Debe seleccionar una sucursal"),
  hiredDate: z.string()
    .min(1, "La fecha de contratación es requerida"),
  isActive: z.boolean().default(true)
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>