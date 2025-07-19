import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(branches);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener sucursales' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, address, phone, email, schedule } = body;

    const branch = await prisma.branch.create({
      data: {
        name,
        address,
        phone,
        email,
        schedule,
      },
    });

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear sucursal' }, { status: 500 });
  }
}
