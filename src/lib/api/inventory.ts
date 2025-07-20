import { Inventory, Movement } from "@/lib/types";
import { prisma } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { getAuthenticatedUser } from "@/app/lib/util";

export async function getInventory(branchId?: string): Promise<Inventory[]> {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");

  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Usuario no encontrado");

  try {
    const isSuperAdmin = user.roles.some(role => role.role.name === "SUPER_ADMIN");
    const userBranchId = user.employee?.branchId;

    const where = isSuperAdmin 
      ? branchId ? { branchId } : {}
      : { branchId: userBranchId };

    return await prisma.inventory.findMany({
      where,
      include: {
        product: true,
        branch: true
      },
      orderBy: { updatedAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw new Error("Error fetching inventory");
  }
}

export async function getInventoryItem(id: string): Promise<Inventory | null> {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");

  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Usuario no encontrado");

  try {
    const item = await prisma.inventory.findUnique({
      where: { id },
      include: {
        product: true,
        branch: true
      }
    });

    if (!item) return null;

    // Verificar permisos
    const isSuperAdmin = user.roles.some(role => role.role.name === "SUPER_ADMIN");
    if (!isSuperAdmin && user.employee?.branchId !== item.branchId) {
      throw new Error("No tienes permisos para ver este item");
    }

    return item;
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    throw error;
  }
}

export async function updateInventoryItem(
  id: string,
  data: { quantity?: number; minStock?: number }
): Promise<Inventory> {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");

  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Usuario no encontrado");

  try {
    // Verificar permisos antes de actualizar
    const item = await prisma.inventory.findUnique({
      where: { id },
      select: { branchId: true }
    });

    if (!item) throw new Error("Item no encontrado");

    const isSuperAdmin = user.roles.some(role => role.role.name === "SUPER_ADMIN");
    if (!isSuperAdmin && user.employee?.branchId !== item.branchId) {
      throw new Error("No tienes permisos para actualizar este item");
    }

    return await prisma.inventory.update({
      where: { id },
      data: {
        quantity: data.quantity,
        minStock: data.minStock,
        updatedAt: new Date()
      },
      include: {
        product: true,
        branch: true
      }
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    throw error;
  }
}

export async function getInventoryMovements(
  productId: string,
  branchId: string
): Promise<Movement[]> {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");

  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Usuario no encontrado");

  // Verificar permisos
  const isSuperAdmin = user.roles.some(role => role.role.name === "SUPER_ADMIN");
  if (!isSuperAdmin && user.employee?.branchId !== branchId) {
    throw new Error("No tienes permisos para ver estos movimientos");
  }

  try {
    return await prisma.movement.findMany({
      where: {
        productId,
        ...(isSuperAdmin ? {} : { branchId })
      },
      include: {
        product: true,
        employee: true,
        user: true
      },
      orderBy: { date: "desc" }
    });
  } catch (error) {
    console.error("Error fetching inventory movements:", error);
    throw error;
  }
}

export async function createInventoryMovement(
  data: {
    type: 'INGRESS' | 'EGRESS' | 'ADJUSTMENT' | 'LOSS';
    productId: string;
    quantity: number;
    branchId: string;
    notes?: string;
    reference?: string;
  }
): Promise<Movement> {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");

  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Usuario no encontrado");

  // Verificar permisos
  const isSuperAdmin = user.roles.some(role => role.role.name === "SUPER_ADMIN");
  if (!isSuperAdmin && user.employee?.branchId !== data.branchId) {
    throw new Error("No tienes permisos para crear movimientos en esta sucursal");
  }

  try {
    // Crear el movimiento
    const movement = await prisma.movement.create({
      data: {
        type: data.type,
        productId: data.productId,
        quantity: data.quantity,
        branchId: data.branchId,
        employeeId: user.employee?.id,
        userId: user.id,
        notes: data.notes,
        reference: data.reference,
        date: new Date()
      },
      include: {
        product: true,
        employee: true,
        user: true
      }
    });

    // Actualizar el inventario
    const inventory = await prisma.inventory.findUnique({
      where: {
        branchId_productId: {
          branchId: data.branchId,
          productId: data.productId
        }
      }
    });

    if (inventory) {
      let newQuantity = inventory.quantity;
      if (data.type === 'INGRESS') {
        newQuantity += data.quantity;
      } else {
        newQuantity -= data.quantity;
      }

      await prisma.inventory.update({
        where: { id: inventory.id },
        data: { quantity: newQuantity, updatedAt: new Date() }
      });
    } else if (data.type === 'INGRESS') {
      // Crear nuevo registro de inventario si no existe
      await prisma.inventory.create({
        data: {
          branchId: data.branchId,
          productId: data.productId,
          quantity: data.quantity,
          minStock: 0
        }
      });
    }

    return movement;
  } catch (error) {
    console.error("Error creating inventory movement:", error);
    throw error;
  }
}