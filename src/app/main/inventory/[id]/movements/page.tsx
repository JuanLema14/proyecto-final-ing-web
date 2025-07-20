import { getInventoryItem, getInventoryMovements } from "@/lib/api/inventory";
import { notFound } from "next/navigation";
import { DataTable } from "@/components/ui/data-table/data-table";
import { inventoryMovementColumns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function InventoryMovementsPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getInventoryItem(params.id);
  if (!item) return notFound();

  const movements = await getInventoryMovements(
    item.productId,
    item.branchId
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Movimientos de {item.product.name}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/main/inventory/${params.id}`}>Volver al detalle</Link>
          </Button>
          <Button asChild>
            <Link href="/main/inventory/new-movement">Nuevo movimiento</Link>
          </Button>
        </div>
      </div>

      <DataTable
        columns={inventoryMovementColumns}
        data={movements}
        searchKey="product.name"
      />
    </div>
  );
}