import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: true,
        branch: true,
      },
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener empleados" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, branchId, position, salary, hiredDate } = body;

    const newEmployee = await prisma.employee.create({
      data: {
        userId,
        branchId,
        position,
        salary,
        hiredDate: new Date(hiredDate),
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear empleado" }, { status: 500 });
  }
}
