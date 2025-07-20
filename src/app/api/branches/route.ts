import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { branchFormSchema } from '@/lib/validations/branch';

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
    console.log("[POST /api/branches] Iniciando...");
    
    // 1. Parsear el body
    const body = await req.json();
    console.log("[POST /api/branches] Body recibido:", JSON.stringify(body, null, 2));

    // 2. Validar con Zod
    const parsed = branchFormSchema.safeParse(body);
    if (!parsed.success) {
      console.error("[POST /api/branches] Error de validación:", parsed.error);
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error },
        { status: 400 }
      );
    }
    console.log("[POST /api/branches] Datos validados:", parsed.data);

    // 3. Crear en DB
    const scheduleString = JSON.stringify(parsed.data.schedule);
    console.log("[POST /api/branches] Schedule convertido:", scheduleString);

    const branch = await prisma.branch.create({
      data: {
        ...parsed.data,
        schedule: scheduleString,
      },
    });

    console.log("[POST /api/branches] Sucursal creada:", branch);
    return NextResponse.json(branch, { status: 201 });

  } catch (error) {
    console.error("[POST /api/branches] Error crítico:", error);
    return NextResponse.json(
      { error: 'Error interno al crear sucursal' },
      { status: 500 }
    );
  }
}
