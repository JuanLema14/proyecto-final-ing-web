import { prisma } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";

export async function getProducts() {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");

  return await prisma.product.findMany();
}

export async function getBranches() {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");

  return await prisma.branch.findMany();
}
