import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    const role = user?.roles?.[0]?.role?.name;
    const isAdmin = role === "SUPER_ADMIN";
    const isManager = role === "GERENTE_SUCURSAL";

    if (!isAdmin && !isManager) {
      return NextResponse.json(
        { error: "No tienes permisos para crear empleados" },
        { status: 403 }
      );
    }

    const {
      user: userData,
      position,
      salary,
      branchId,
      hiredDate,
      isActive,
    } = data;

    if (!userData?.email || !userData?.name || !branchId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Buscar usuario existente por email
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    let newUser;

    if (!existingUser) {
      newUser = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
        },
      });
    } else {
      newUser = existingUser;

      // Verificar si ya es empleado
      const existingEmployee = await prisma.employee.findUnique({
        where: { userId: newUser.id },
      });

      if (existingEmployee) {
        return NextResponse.json(
          { error: "Este usuario ya está registrado como empleado" },
          { status: 409 }
        );
      }
    }

    const employee = await prisma.employee.create({
      data: {
        userId: newUser.id,
        position,
        salary,
        branchId,
        hiredDate: hiredDate ? new Date(hiredDate) : new Date(),
        isActive: isActive ?? true,
      },
      include: {
        user: true,
        branch: true,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error al crear empleado:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
