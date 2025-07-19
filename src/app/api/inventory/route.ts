import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  const data = await prisma.inventory.findMany({
    include: {
      branch: true,
      product: true
    },
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const inventory = await prisma.inventory.create({
      data: {
        branchId: body.branchId,
        productId: body.productId,
        quantity: body.quantity,
        minStock: body.minStock
      },
    });

    return NextResponse.json(inventory, { status: 201 });
  } catch (error) {
    console.error('Error creando inventario:', error);
    return NextResponse.json({ error: 'Error al crear inventario' }, { status: 500 });
  }
}
