import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { auth } from '@/app/lib/auth'
import type { NextRequest } from 'next/server'

async function checkAuth() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return session
}

export async function GET(
  _request: NextRequest,
  context: any
): Promise<NextResponse> {
  const session = await checkAuth()
  if (!session || !context.params.id) return session as any

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: context.params.id },
      include: {
        user: true,
        branch: true,
        attendances: true,
        schedules: true,
      },
    })

    if (!employee) {
      return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 })
    }

    return NextResponse.json(employee)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el empleado' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  const session = await checkAuth()
  if (!session || !context.params.id) return session as any

  try {
    const data = await request.json()

    const employee = await prisma.employee.update({
      where: { id: context.params.id },
      data,
      include: {
        user: true,
        branch: true,
      },
    })

    return NextResponse.json(employee)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar el empleado' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: any
): Promise<NextResponse> {
  const session = await checkAuth()
  if (!session || !context.params.id) return session as any

  try {
    await prisma.employee.update({
      where: { id: context.params.id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Empleado desactivado' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al desactivar el empleado' },
      { status: 500 }
    )
  }
}