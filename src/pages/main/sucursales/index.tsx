"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sucursal } from "@/lib/types";
import { IconBuildingStore, IconEdit, IconTrash, IconBox } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch("/api/sucursales");
        const data = await response.json();
        setSucursales(data);
      } catch (error) {
        toast.error("Error al cargar sucursales");
      } finally {
        setLoading(false);
      }
    };

    fetchSucursales();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/sucursales/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSucursales(sucursales.filter((s) => s.id !== id));
        toast.success("Sucursal eliminada correctamente");
      } else {
        toast.error("Error al eliminar sucursal");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    }
  };

  const columns = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }: { row: { original: Sucursal } }) => (
        <div className="flex items-center gap-2">
          <IconBuildingStore className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.nombre}</span>
        </div>
      ),
    },
    {
      accessorKey: "ciudad",
      header: "Ciudad",
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
    },
    {
      accessorKey: "estaActiva",
      header: "Estado",
      cell: ({ row }: { row: { original: Sucursal } }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.estaActiva
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.estaActiva ? "Activa" : "Inactiva"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: Sucursal } }) => (
        <div className="flex gap-2">
          {/* Botón de editar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  router.push(`/main/sucursales/editar/${row.original.id}`)
                }
              >
                <IconEdit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar sucursal</TooltipContent>
          </Tooltip>

          {/* Botón de inventario */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  router.push(`/main/sucursales/${row.original.id}/inventario`)
                }
              >
                <IconBox className="h-4 w-4 text-blue-600" />
                <span className="sr-only">Inventario</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver inventario</TooltipContent>
          </Tooltip>

          {/* Botón de eliminar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(row.original.id)}
              >
                <IconTrash className="h-4 w-4 text-red-500" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Eliminar sucursal</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sucursales</h2>
          <p className="text-muted-foreground">
            Listado completo de todas las sucursales registradas
          </p>
        </div>
        <Link href="/main/sucursales/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Sucursal
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={sucursales}
        loading={loading}
        emptyMessage="No hay sucursales registradas"
      />
    </div>
  );
}
