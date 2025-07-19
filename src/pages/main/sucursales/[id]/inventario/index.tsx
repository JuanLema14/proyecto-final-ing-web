"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/admin/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Plus, Save } from "lucide-react";
import Link from "next/link";

interface Ingrediente {
  id: number;
  nombre: string;
  unidadMedida: string;
}

interface Inventario {
  idSucursal: number;
  idIngrediente: number;
  stockActual: number;
  stockMinimo: number;
  ultimaActualizacion: string;
  ingrediente: Ingrediente;
}

export default function InventarioSucursalPage() {
  const { id } = useParams();
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<
    Record<number, { stockActual: number; stockMinimo: number }>
  >({});

  // Formulario agregar
  const [selectedIngrediente, setSelectedIngrediente] = useState<string>("");
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, ingRes] = await Promise.all([
          fetch(`/api/inventario/${id}`),
          fetch(`/api/ingredientes`),
        ]);

        const invData = await invRes.json();
        const ingData = await ingRes.json();

        setInventario(invData);

        const usados = new Set(
          invData.map((inv: Inventario) => inv.idIngrediente)
        );
        const disponibles = ingData.filter(
          (ing: Ingrediente) => !usados.has(ing.id)
        );
        setIngredientes(disponibles);
      } catch {
        toast.error("Error al cargar datos.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, open]);

  const handleChange = (
    idIngrediente: number,
    field: "stockActual" | "stockMinimo",
    value: string
  ) => {
    setEditedData((prev) => ({
      ...prev,
      [idIngrediente]: {
        ...prev[idIngrediente],
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  const handleSave = async (idIngrediente: number) => {
    const edit = editedData[idIngrediente];
    if (!edit) return;

    const original = inventario.find(
      (item) => item.idIngrediente === idIngrediente
    );
    if (!original) return;

    const payload = {
      idIngrediente,
      stockActual: Number(edit.stockActual ?? original.stockActual),
      stockMinimo: Number(edit.stockMinimo ?? original.stockMinimo),
    };

    setSavingId(idIngrediente);
    try {
      const res = await fetch(`/api/inventario/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      toast.success("Inventario actualizado.");
      setEditedData((prev) => {
        const updated = { ...prev };
        delete updated[idIngrediente];
        return updated;
      });

      setInventario((prev) =>
        prev.map((item) =>
          item.idIngrediente === idIngrediente
            ? {
                ...item,
                ...payload,
                ultimaActualizacion: new Date().toISOString(),
              }
            : item
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar.");
    } finally {
      setSavingId(null);
    }
  };

  const handleAgregarIngrediente = async () => {
    if (!selectedIngrediente || !stockActual || !stockMinimo) {
      toast.warning("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch(`/api/inventario/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idIngrediente: parseInt(selectedIngrediente),
          stockActual: parseFloat(stockActual),
          stockMinimo: parseFloat(stockMinimo),
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Ingrediente agregado");
      setOpen(false);
      setSelectedIngrediente("");
      setStockActual("");
      setStockMinimo("");
    } catch {
      toast.error("No se pudo agregar el ingrediente");
    }
  };

  const columns = [
    {
      accessorKey: "ingrediente.nombre",
      header: "Ingrediente",
      cell: ({ row }: any) => row.original.ingrediente.nombre,
    },
    {
      accessorKey: "ingrediente.unidadMedida",
      header: "Unidad",
      cell: ({ row }: any) => row.original.ingrediente.unidadMedida,
    },
    {
      accessorKey: "stockActual",
      header: "Stock Actual",
      cell: ({ row }: any) => {
        const idIng = row.original.idIngrediente;
        const value =
          editedData[idIng]?.stockActual ?? row.original.stockActual;
        return (
          <Input
            type="number"
            className="w-24"
            value={value}
            onChange={(e) => handleChange(idIng, "stockActual", e.target.value)}
          />
        );
      },
    },
    {
      accessorKey: "stockMinimo",
      header: "Stock Mínimo",
      cell: ({ row }: any) => {
        const idIng = row.original.idIngrediente;
        const value =
          editedData[idIng]?.stockMinimo ?? row.original.stockMinimo;
        return (
          <Input
            type="number"
            className="w-24"
            value={value}
            onChange={(e) => handleChange(idIng, "stockMinimo", e.target.value)}
          />
        );
      },
    },
    {
      accessorKey: "ultimaActualizacion",
      header: "Actualizado",
      cell: ({ row }: any) =>
        new Date(row.original.ultimaActualizacion).toLocaleString(),
    },
    {
      accessorKey: "acciones",
      header: "",
      cell: ({ row }: any) => {
        const idIng = row.original.idIngrediente;
        const hasChanges = editedData[idIng];
        return hasChanges ? (
          <Button
            size="sm"
            onClick={() => handleSave(idIng)}
            disabled={savingId === idIng}
          >
            {savingId === idIng ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              <Save className="size-4 mr-2" />
            )}
            Guardar
          </Button>
        ) : null;
      },
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Inventario de la Sucursal #{id}
          </h2>
          <p className="text-muted-foreground">
            Lista de ingredientes y sus niveles de inventario.
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Ingrediente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Ingrediente</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Ingrediente</Label>
                  <Select
                    value={selectedIngrediente}
                    onValueChange={setSelectedIngrediente}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un ingrediente" />
                    </SelectTrigger>
                    <SelectContent>
                      {ingredientes.map((ing) => (
                        <SelectItem key={ing.id} value={ing.id.toString()}>
                          {ing.nombre} ({ing.unidadMedida})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Stock actual</Label>
                  <Input
                    type="number"
                    value={stockActual}
                    onChange={(e) => setStockActual(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Stock mínimo</Label>
                  <Input
                    type="number"
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleAgregarIngrediente}
                  className="w-full mt-2"
                >
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/main/sucursales">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Sucursales
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={inventario}
        loading={loading}
        emptyMessage="No hay datos de inventario disponibles"
      />
    </div>
  );
}
