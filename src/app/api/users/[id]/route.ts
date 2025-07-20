import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/db"

export async function GET(
  req: NextRequest,
  context: any
): Promise<NextResponse> {
  try {
    const { id } = context.params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } },
        employee: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" }, 
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener usuario" }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  context: any
): Promise<NextResponse> {
  try {
    const { id } = context.params
    const body = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar usuario" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
): Promise<NextResponse> {
  try {
    const { id } = context.params

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Usuario eliminado" })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar usuario" }, 
      { status: 500 }
    )
  }
}