"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { inventoryMovementSchema } from "@/lib/validations/inventory";
import { createInventoryMovement } from "@/lib/api/inventory";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ErrorMessage } from "@/components/error-message";
import { Loader2 } from "lucide-react";

// Mover las funciones de API a un archivo separado o usar fetch directamente
const fetchProducts = async () => {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
};

const fetchBranches = async () => {
  const res = await fetch('/api/branches');
  if (!res.ok) throw new Error('Error al cargar sucursales');
  return res.json();
};

const fetchCurrentUser = async (userId: string) => {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error('Error al obtener usuario');
  return res.json();
};

export default function NewMovementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [currentUserBranchId, setCurrentUserBranchId] = useState<string | null>(null);

  // Verificar autenticación
  if (status === "unauthenticated") {
    return (
      <div className="p-4">
        <ErrorMessage
          message="No estás autenticado. Por favor, inicia sesión."
          title="Acceso denegado"
        />
      </div>
    );
  }

  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  // Obtener datos del usuario actual
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser", session?.user.id],
    queryFn: () => fetchCurrentUser(session?.user.id || ''),
    enabled: !isSuperAdmin && !!session?.user.id,
  });

  // Obtener productos
  const { 
    data: products, 
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener sucursales
  const { 
    data: allBranches, 
    isLoading: branchesLoading,
    error: branchesError,
    refetch: refetchBranches
  } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Actualizar branchId cuando se obtiene el usuario
  useEffect(() => {
    if (currentUser?.employee?.branchId) {
      setCurrentUserBranchId(currentUser.employee.branchId);
    }
  }, [currentUser]);

  // Filtrar sucursales según el rol
  const branches = isSuperAdmin 
    ? allBranches 
    : allBranches?.filter(branch => branch.id === currentUserBranchId);

  // Configuración del formulario
  const form = useForm({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: {
      type: "INGRESS",
      productId: "",
      branchId: currentUserBranchId || "",
      quantity: 0,
      notes: "",
      reference: "",
    },
  });

  // Establecer branchId por defecto si no es SUPER_ADMIN
  useEffect(() => {
    if (!isSuperAdmin && currentUserBranchId) {
      form.setValue("branchId", currentUserBranchId);
    }
  }, [currentUserBranchId, form, isSuperAdmin]);

  // Manejar estados de carga
  if (userLoading || productsLoading || branchesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg">Cargando datos necesarios...</p>
        </div>
      </div>
    );
  }

  // Manejar errores
  if (productsError || branchesError) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <ErrorMessage
          message={productsError?.message || branchesError?.message || "Error al cargar los datos necesarios"}
          title="Error de carga"
        />
        <div className="flex gap-4 mt-4">
          <Button 
            onClick={() => {
              if (productsError) refetchProducts();
              if (branchesError) refetchBranches();
            }}
            variant="default"
          >
            Reintentar
          </Button>
          <Button 
            onClick={() => router.push("/main/inventory")}
            variant="outline"
          >
            Volver al inventario
          </Button>
        </div>
      </div>
    );
  }

  // Verificar que tenemos los datos necesarios
  if (!products || !allBranches) {
    return (
      <div className="p-4">
        <ErrorMessage
          message="No se pudieron cargar los datos necesarios. Por favor, intente nuevamente."
          title="Datos faltantes"
        />
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      await createInventoryMovement(data);
      toast({
        title: "Éxito",
        description: "Movimiento creado correctamente",
      });
      router.push("/main/inventory");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al crear el movimiento",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) router.push("/main/inventory");
        setOpen(val);
      }}
    >
       <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo Movimiento de Inventario</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de movimiento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black text-white">
                        <SelectItem value="INGRESS">Entrada</SelectItem>
                        <SelectItem value="EGRESS">Salida</SelectItem>
                        <SelectItem value="ADJUSTMENT">Ajuste</SelectItem>
                        <SelectItem value="LOSS">Pérdida</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sucursal</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!isSuperAdmin}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una sucursal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black text-white">
                        {branches?.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producto</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={productsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black text-white">
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referencia (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="N° de factura, remito, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Motivo del movimiento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/main/inventory")}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar movimiento"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}