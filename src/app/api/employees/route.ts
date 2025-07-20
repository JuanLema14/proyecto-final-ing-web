import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { auth } from '@/app/lib/auth'

export async function GET() {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    )
  }

  try {
    // Verificar rol del usuario
    const userWithRoles = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    const hasPermission = userWithRoles?.roles.some(ur => 
      ['SUPER_ADMIN', 'GERENTE_SUCURSAL'].includes(ur.role.name)
    )

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'No tienes permisos para ver empleados' },
        { status: 403 }
      )
    }

    const employees = await prisma.employee.findMany({
      include: {
        user: true,
        branch: true
      },
      where: {
        branch: {
          employees: {
            some: {
              userId: session.user.id
            }
          }
        }
      }
    })
    
    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()

  try {
    // Verificar que el usuario tiene permisos en la sucursal
    const canManageBranch = await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
        branchId: data.branchId,
        user: {
          roles: {
            some: {
              role: {
                name: {
                  in: ['SUPER_ADMIN', 'GERENTE_SUCURSAL']
                }
              }
            }
          }
        }
      }
    })

    if (!canManageBranch) {
      return NextResponse.json(
        { error: 'No tienes permisos para esta sucursal' },
        { status: 403 }
      )
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        hiredDate: new Date(data.hiredDate || new Date()),
        userId: session.user.id
      },
      include: {
        user: true,
        branch: true
      }
    })

    return NextResponse.json(employee)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}