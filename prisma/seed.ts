import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Eliminar roles existentes si quieres reemplazarlos
  await prisma.userRole.deleteMany({})
  await prisma.role.deleteMany({})

  // Crear nuevos roles
  await prisma.role.createMany({
    data: [
      { name: 'SUPER_ADMIN', permissions: ['all'] },
      { name: 'GERENTE_SUCURSAL', permissions: ['menu:write', 'orders:read'] },
      { name: 'MESERO', permissions: ['orders:write'] },
    ],
  })

  // Crear o actualizar sucursal
  const branch = await prisma.branch.upsert({
    where: { name: 'Sucursal Principal' },
    update: {},
    create: {
      name: 'Sucursal Principal',
      address: 'Calle 123, Medellín',
      phone: '+5741234567',
      email: 'contacto@restaurante.com',
      isActive: true,
      schedule: {
        monday: { open: '08:00', close: '22:00' },
        tuesday: { open: '08:00', close: '22:00' },
      },
    },
  })

  // Crear usuarios con los nuevos roles
  const users = [
    {
      email: 'superadmin@demo.com',
      name: 'Super Admin',
      password: '123456',
      roleName: 'SUPER_ADMIN',
    },
    {
      email: 'gerente@demo.com',
      name: 'Gerente',
      password: '123456',
      roleName: 'GERENTE_SUCURSAL',
    },
    {
      email: 'mesero@demo.com',
      name: 'Mesero',
      password: '123456',
      roleName: 'MESERO',
    },
  ]

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)

    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
      },
    })

    const role = await prisma.role.findUnique({
      where: { name: user.roleName },
    })

    if (role) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: createdUser.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: createdUser.id,
          roleId: role.id,
          assignedBy: null,
        },
      })
    }

    // Registrar como empleado si no es SUPER_ADMIN
    if (user.roleName !== 'SUPER_ADMIN') {
      await prisma.employee.upsert({
        where: { userId: createdUser.id },
        update: {},
        create: {
          userId: createdUser.id,
          branchId: branch.id,
          position: user.roleName,
          salary: 2000,
          hiredDate: new Date(),
        },
      })
    }
  }

  console.log('✅ Nuevos roles y usuarios creados con éxito.')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
