"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function NuevaSucursalPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    telefono: "",
    emailContacto: "",
    horaApertura: "",
    horaCierre: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/sucursales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          horaApertura: new Date(`1970-01-01T${form.horaApertura}:00`),
          horaCierre: new Date(`1970-01-01T${form.horaCierre}:00`),
        }),
      });

      if (!res.ok) throw new Error("Error al crear sucursal");

      toast.success("Sucursal creada exitosamente");
      router.push("/main/sucursales");
    } catch (err) {
      toast.error("No se pudo crear la sucursal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Crear nueva sucursal</h2>
        <p className="text-muted-foreground">
          Llena los campos para registrar una nueva sucursal
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["nombre", "direccion", "ciudad", "telefono", "emailContacto"].map(
          (field) => (
            <div key={field} className="space-y-1">
              <Label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                required
              />
            </div>
          )
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="horaApertura">Hora de apertura</Label>
            <Input
              type="time"
              id="horaApertura"
              name="horaApertura"
              value={form.horaApertura}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="horaCierre">Hora de cierre</Label>
            <Input
              type="time"
              id="horaCierre"
              name="horaCierre"
              value={form.horaCierre}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear sucursal"}
        </Button>
      </form>
    </div>
  );
}
