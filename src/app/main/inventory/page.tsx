import { DataTable } from "@/components/ui/data-table/data-table";
import { inventoryColumns } from "./columns";
import { getInventory } from "@/lib/api/inventory";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ErrorMessage } from "@/components/error-message";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { branch?: string };
}) {
  const session = await auth();
  if (!session?.user) return redirect("/login");

  try {
    const inventory = await getInventory(searchParams.branch);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Gestión de Inventario</h1>
          <Button asChild>
            <Link href="/main/inventory/new-movement">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Movimiento
            </Link>
          </Button>
        </div>

        <DataTable
          columns={inventoryColumns}
          data={inventory}
          searchKey="product.name"
          filters={[
            {
              columnId: "branch.name",
              title: "Sucursal",
              options: [
                ...new Set(inventory.map((item) => item.branchId)),
              ].map((branch) => ({
                label: branch,
                value: branch,
              })),
            },
            {
              columnId: "product.category",
              title: "Categoría",
              options: [
                ...new Set(inventory.map((item) => item.product)),
              ].map((category) => ({
                label: category,
                value: category,
              })),
            },
          ]}
        />
      </div>
    );
  } catch (error: any) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
        </div>
        <ErrorMessage
          title="Error al cargar el inventario"
          message={error.message}
        />
      </div>
    );
  }
}