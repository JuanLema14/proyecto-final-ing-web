"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Branch } from "@/lib/types";
import { createBranch, getBranchById, updateBranch } from "@/lib/api/branches";
import { useEffect, useState } from "react";
import { branchFormSchema } from "@/lib/validations/branch";
import { useParams } from "next/navigation";

// Definimos un tipo para nuestros datos del formulario
type BranchFormValues = z.infer<typeof branchFormSchema>;

const defaultSchedule = {
  lunes: "08:00 - 22:00",
  martes: "08:00 - 22:00",
  miercoles: "08:00 - 22:00",
  jueves: "08:00 - 22:00",
  viernes: "08:00 - 23:00",
  sabado: "09:00 - 23:00",
  domingo: "09:00 - 22:00",
};

const daysOfWeek = [
  { id: "lunes", label: "Lunes" },
  { id: "martes", label: "Martes" },
  { id: "miercoles", label: "Miércoles" },
  { id: "jueves", label: "Jueves" },
  { id: "viernes", label: "Viernes" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
] as const;

export default function EditBranchPage() {
  const params = useParams();
  console.log("Params:", params.id, typeof params.id);
  const id = typeof params?.id === "string" ? params.id : "new";

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [branchData, setBranchData] = useState<Branch | null>(null);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      schedule: defaultSchedule,
      isActive: true,
    },
  });

  // Cargar datos de la sucursal
  useEffect(() => {
    const loadBranchData = async () => {
      try {
        const data = await getBranchById(id); // Usamos id en lugar de params.id
        setBranchData(data);

        // Convertir schedule a objeto si viene como string
        const scheduleData =
          typeof data.schedule === "string"
            ? JSON.parse(data.schedule)
            : data.schedule;

        form.reset({
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email || "",
          schedule: scheduleData,
          isActive: data.isActive,
        });
      } catch (error) {
        toast.error("No se pudo cargar la sucursal" + error);
        router.push("/main/branches");
      }
    };

    if (id !== "new") {
      loadBranchData();
    }
  }, [id, form, router]); // Dependencia id en lugar de params.id

  const onSubmit = async (values: BranchFormValues) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (id === "new") {
        // Usamos id en lugar de params.id
        await createBranch(values);
        toast.info("Sucursal creada correctamente");
      } else {
        await updateBranch(id, values); // Usamos id en lugar de params.id
        toast.info("Sucursal actualizada correctamente"); 
      }
      router.push("/main/branches");
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      toast.error("Hubo un problema al guardar la sucursal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-primary">
          {id === "new" ? "Nueva Sucursal" : "Editar Sucursal"}{" "}
          {/* Usamos id */}
        </h1>
        <Button variant="outline" onClick={() => router.push("/main/branches")}>
          Cancelar
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campos básicos (name, phone, address, email) */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Nombre de la Sucursal
                    </FormLabel>
                    <FormControl className="text-gray-500">
                      <Input placeholder="Ej: Sucursal Centro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Teléfono</FormLabel>
                    <FormControl className="text-gray-500">
                      <Input placeholder="Ej: 555-123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-gray-700">Dirección</FormLabel>
                    <FormControl className="text-gray-500">
                      <Textarea
                        placeholder="Dirección completa de la sucursal"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Email (Opcional)
                    </FormLabel>
                    <FormControl className="text-gray-500">
                      <Input
                        placeholder="sucursal@restaurante.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-gray-700">Estado</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {field.value ? "Activa" : "Inactiva"}
                      </p>
                    </div>
                    <FormControl className="text-gray-500">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Sección de Horario */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Horario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {daysOfWeek.map((day) => (
                    <FormField
                      key={day.id}
                      control={form.control}
                      name={`schedule.${day.id}`}
                      render={({ field }) => (
                        <FormItem className="text-gray-500">
                          <FormLabel className="text-gray-700">
                            {day.label}
                          </FormLabel>
                          <FormControl className="text-gray-500">
                            <Input
                              className="text-grey-500"
                              placeholder="Ej: 08:00 - 22:00"
                              {...field}
                              value={field.value as string} // Aseguramos que es string
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/main/branches")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    {/* Spinner SVG */}
                    {params.id === "new" ? "Creando..." : "Actualizando..."}
                  </span>
                ) : params.id === "new" ? (
                  "Crear Sucursal"
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
