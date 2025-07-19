"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { Carrot, Drumstick, Pizza, Leaf, Milk } from "lucide-react";

interface Ingrediente {
  id: number;
  nombre: string;
  unidadMedida: string;
}

export default function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");

  const fetchIngredientes = () => {
    setLoading(true);
    fetch("/api/ingredientes")
      .then((res) => res.json())
      .then((data) => {
        setIngredientes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar ingredientes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  const handleCrearIngrediente = async () => {
    if (!nombre || !unidadMedida) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }
    try {
      const res = await fetch("/api/ingredientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, unidadMedida }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Error al crear ingrediente.");
        return;
      }
      toast.success("Ingrediente creado con éxito.");
      setNombre("");
      setUnidadMedida("");
      setOpen(false);
      fetchIngredientes();
    } catch (err) {
      toast.error("Error de red.");
    }
  };

  function getIngredienteIcon(nombre: string) {
    const lower = nombre.toLowerCase();

    if (
      ["zanahoria", "lechuga", "tomate", "papa", "cebolla"].some((v) =>
        lower.includes(v)
      )
    ) {
      return {
        icon: <Carrot className="text-green-600" size={24} />,
        tipo: "Verdura",
      };
    } else if (
      ["pollo", "res", "carne", "cerdo", "chuleta"].some((v) =>
        lower.includes(v)
      )
    ) {
      return {
        icon: <Drumstick className="text-red-600" size={24} />,
        tipo: "Carne",
      };
    } else if (
      ["queso", "leche", "mantequilla", "yogur"].some((v) => lower.includes(v))
    ) {
      return {
        icon: <Milk className="text-yellow-500" size={24} />,
        tipo: "Lácteo",
      };
    } else if (
      ["albahaca", "cilantro", "oregano", "hierbabuena"].some((v) =>
        lower.includes(v)
      )
    ) {
      return {
        icon: <Leaf className="text-emerald-600" size={24} />,
        tipo: "Hierba",
      };
    } else {
      return {
        icon: <Pizza className="text-muted-foreground" size={24} />,
        tipo: "Otro",
      };
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Ingredientes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nuevo Ingrediente</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Ingrediente</DialogTitle>
              <DialogDescription>
                Llena los campos para registrar un nuevo ingrediente.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidad">Unidad de Medida</Label>
                <Input
                  id="unidad"
                  value={unidadMedida}
                  onChange={(e) => setUnidadMedida(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCrearIngrediente}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          : ingredientes.map((ingrediente) => {
              const { icon, tipo } = getIngredienteIcon(ingrediente.nombre);

              return (
                <Card
                  key={ingrediente.id}
                  className="rounded-2xl shadow-md hover:shadow-lg transition duration-200"
                >
                  <CardContent className="p-4 flex flex-col gap-2 h-full">
                    <div className="flex items-center gap-2">{icon}</div>
                    <h2 className="text-lg font-medium text-primary">
                      {ingrediente.nombre}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Unidad: {ingrediente.unidadMedida}
                    </p>
                    <span className="text-xs text-muted-foreground italic">
                      Tipo: {tipo}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
