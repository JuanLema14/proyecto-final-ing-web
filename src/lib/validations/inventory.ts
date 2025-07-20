import z from "zod";

export const inventoryMovementSchema = z.object({
  type: z.enum(["INGRESS", "EGRESS", "ADJUSTMENT", "LOSS"]),
  productId: z.string().min(1, "Debe seleccionar un producto"),
  branchId: z.string().min(1, "Debe seleccionar una sucursal"),
  quantity: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
  notes: z.string().optional(),
  reference: z.string().optional(),
});

export type InventoryMovementValues = z.infer<typeof inventoryMovementSchema>;