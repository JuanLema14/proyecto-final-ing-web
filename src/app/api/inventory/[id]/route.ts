import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = await prisma.inventory.findUnique({
    where: { id: params.id },
    include: { branch: true, product: true }
  });

  if (!item) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  try {
    const updated = await prisma.inventory.update({
      where: { id: params.id },
      data: {
        quantity: body.quantity,
        minStock: body.minStock,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error actualizando inventario:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.inventory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar inventario:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
