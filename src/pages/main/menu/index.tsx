"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { LayoutGrid } from "lucide-react";

interface CategoriaMenu {
  id: number;
  nombre: string;
  descripcion?: string;
}

export default function MenuCategoriasPage() {
  const [categorias, setCategorias] = useState<CategoriaMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categorias-menu");
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      toast.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleCrearCategoria = async () => {
    if (!nombre) {
      toast.error("El nombre es obligatorio.");
      return;
    }

    try {
      const res = await fetch("/api/categorias-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Error al crear la categoría.");
        return;
      }

      toast.success("Categoría creada exitosamente.");
      setNombre("");
      setDescripcion("");
      setOpen(false);
      fetchCategorias();
    } catch (error) {
      toast.error("Error de red.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Categorías del Menú</h1>
          <p className="text-muted-foreground text-sm">
            Administra las categorías de los platos disponibles.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nueva Categoría</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Categoría</DialogTitle>
              <DialogDescription>
                Ingresa el nombre y la descripción opcional de la categoría.
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
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCrearCategoria}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          : categorias.map((cat) => (
              <Card
                key={cat.id}
                className="rounded-2xl shadow-md hover:shadow-lg transition duration-200"
              >
                <CardContent className="p-4 flex flex-col gap-2 h-full">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="text-indigo-600" size={24} />
                    <h2 className="text-lg font-medium">{cat.nombre}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {cat.descripcion || "Sin descripción"}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
