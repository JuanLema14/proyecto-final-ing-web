import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const movement = await prisma.movement.findUnique({
      where: { id: params.id },
      include: {
        product: true,
        employee: true,
        user: true,
      },
    });

    if (!movement) {
      return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
    }

    return NextResponse.json(movement);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching movement', details: error }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const updated = await prisma.movement.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating movement', details: error }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.movement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting movement', details: error }, { status: 500 });
  }
}
