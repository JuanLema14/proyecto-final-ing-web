import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    type,
    productId,
    quantity,
    date,
    employeeId,
    userId,
    notes,
    reference,
  } = body;

  try {
    const movement = await prisma.movement.create({
      data: {
        type,
        product: { connect: { id: productId } },
        quantity,
        date: date ? new Date(date) : undefined,
        notes,
        reference,
        employee: employeeId ? { connect: { id: employeeId } } : undefined,
        user: userId ? { connect: { id: userId } } : undefined,
      },
    });

    return NextResponse.json(movement);
  } catch (error) {
    console.error("Error al crear movimiento:", error);
    return NextResponse.json(
      { error: "Error al crear movimiento" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const branchId = searchParams.get("branchId");
  const productId = searchParams.get("productId");

  const where: any = {};
  if (branchId) where.branchId = branchId;
  if (productId) where.productId = productId;

  try {
    const movements = await prisma.movement.findMany({
      where,
      include: {
        product: true,
        user: true,
        employee: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(movements);
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return NextResponse.json(
      { error: "Error al obtener movimientos" },
      { status: 500 }
    );
  }
}
