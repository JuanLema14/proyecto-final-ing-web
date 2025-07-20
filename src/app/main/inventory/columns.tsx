'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Inventory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const inventoryColumns: ColumnDef<Inventory>[] = [
  {
    accessorKey: "product.name",
    header: "Producto",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.product.name}
        <div className="text-sm text-gray-500">
          {row.original.product.category}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "branch.name",
    header: "Sucursal",
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cantidad
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const quantity = parseFloat(row.getValue("quantity"));
      const minStock = row.original.minStock;
      const isLow = quantity <= minStock;

      return (
        <div className="flex items-center">
          <span className={isLow ? "text-red-600 font-bold" : ""}>
            {quantity} {row.original.product.unit}
          </span>
          {isLow && (
            <Badge variant="destructive" className="ml-2">
              Bajo stock
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "minStock",
    header: "Mínimo",
    cell: ({ row }) => (
      <span>
        {row.original.minStock} {row.original.product.unit}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Última actualización",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const inventory = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/main/inventory/${inventory.id}`}>Ver detalles</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/main/inventory/${inventory.id}/movements`}>
                Ver movimientos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/main/inventory/${inventory.id}/edit`}>
                Editar stock
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];