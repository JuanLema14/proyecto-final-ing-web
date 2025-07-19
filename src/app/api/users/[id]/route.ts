import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        employee: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Usuario eliminado" })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
