import { prisma } from '@/app/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const branch = await prisma.branch.findUnique({
      where: { id: params.id },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Sucursal no encontrada' }, { status: 404 });
    }

    return NextResponse.json(branch);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener sucursal' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, address, phone, email, schedule, isActive } = body;

    const updated = await prisma.branch.update({
      where: { id: params.id },
      data: { name, address, phone, email, schedule, isActive },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar sucursal' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await prisma.branch.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Sucursal desactivada', data: deleted });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar sucursal' }, { status: 500 });
  }
}
