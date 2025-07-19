import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";

export async function GET() {
  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return new NextResponse("No autenticado", { status: 401 });
  }

  const userWithRoles = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  const esAdmin = userWithRoles?.roles.some(r => r.role.name === "ADMIN");

  if (!esAdmin) {
    return new NextResponse("No autorizado", { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name || !Array.isArray(permissions)) {
      return new NextResponse("Nombre y permisos son requeridos", { status: 400 });
    }

    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions,
      },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    console.error("Error al crear rol:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
