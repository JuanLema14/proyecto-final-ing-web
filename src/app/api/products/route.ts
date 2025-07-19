import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      barcode: body.barcode,
      unit: body.unit,
      cost: body.cost,
      category: body.category,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
