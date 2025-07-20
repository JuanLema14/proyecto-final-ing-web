"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Movement } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const inventoryMovementColumns: ColumnDef<Movement>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return format(date, "PPPp", { locale: es });
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type");
      const variants = {
        INGRESS: "default",
        EGRESS: "destructive",
        ADJUSTMENT: "warning",
        LOSS: "outline",
      };
      const labels = {
        INGRESS: "Entrada",
        EGRESS: "Salida",
        ADJUSTMENT: "Ajuste",
        LOSS: "Pérdida",
      };
      return (
        <Badge variant={variants[type as keyof typeof variants]}>
          {labels[type as keyof typeof labels]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      const quantity = parseFloat(row.getValue("quantity"));
      const product = row.original.product;
      return `${quantity} ${product.unit}`;
    },
  },
  {
    accessorKey: "product.name",
    header: "Producto",
  },
  {
    accessorKey: "employee",
    header: "Responsable",
    cell: ({ row }) => {
      const employee = row.original.employee;
      const user = row.original.user;
      return employee?.user.name || user?.name || "Sistema";
    },
  },
  {
    accessorKey: "notes",
    header: "Notas",
  },
];