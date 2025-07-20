import { prisma } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  try {
    const { id } = context.params
    
    const branch = await prisma.branch.findUniqueOrThrow({
      where: { id },
    })

    return NextResponse.json(branch)
  } catch (error) {
    return NextResponse.json(
      { error: 'Sucursal no encontrada' },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  try {
    const { id } = context.params
    const data = await request.json()

    if (!data.name || !data.address) {
      return NextResponse.json(
        { error: 'Nombre y dirección son requeridos' },
        { status: 400 }
      )
    }

    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        schedule: data.schedule,
        isActive: data.isActive ?? true
      }
    })

    return NextResponse.json(updatedBranch)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar sucursal' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  try {
    const { id } = context.params

    const deletedBranch = await prisma.branch.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({
      success: true,
      message: 'Sucursal desactivada correctamente',
      data: deletedBranch
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al desactivar sucursal' },
      { status: 500 }
    )
  }
}