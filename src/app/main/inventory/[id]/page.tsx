import { getInventoryItem } from "@/lib/api/inventory";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function InventoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getInventoryItem(params.id);
  if (!item) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Detalle de Inventario</h1>
        <Button asChild>
          <Link href="/main/inventory">Volver al inventario</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{item.product.name}</span>
            <Badge
              variant={
                item.quantity <= item.minStock ? "destructive" : "default"
              }
            >
              {item.quantity <= item.minStock ? "Bajo stock" : "Disponible"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Producto</h3>
              <p>{item.product.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
              <p>{item.product.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Unidad</h3>
              <p>{item.product.unit}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sucursal</h3>
              <p>{item.branch.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cantidad</h3>
              <p>
                {item.quantity} {item.product.unit}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Stock mínimo</h3>
              <p>
                {item.minStock} {item.product.unit}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={`/main/inventory/${params.id}/movements`}>
            Ver movimientos
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/main/inventory/${params.id}/edit`}>Editar stock</Link>
        </Button>
      </div>
    </div>
  );
}