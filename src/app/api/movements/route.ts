import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const movement = await prisma.movement.create({
      data: {
        type: body.type,
        productId: body.productId,
        quantity: body.quantity,
        employeeId: body.employeeId || null,
        userId: body.userId || null,
        notes: body.notes || null,
        reference: body.reference || null,
      },
    });

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating movement', details: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const movements = await prisma.movement.findMany({
      include: {
        product: true,
        employee: true,
        user: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(movements);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching movements', details: error }, { status: 500 });
  }
}
