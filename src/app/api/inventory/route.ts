import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { auth } from '@/app/lib/auth'

export async function GET() {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
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
    
    return NextResponse.json(inventory)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}