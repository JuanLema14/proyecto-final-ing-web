// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('⚠️ Starting database seeding process...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  // 1. Verificar si las tablas existen antes de intentar limpiarlas
  console.log('🧹 Checking database state...');
  try {
    // Método seguro para limpiar la base de datos
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE 
      "Report", "Payment", "OrderItem", "Order", "Recipe", 
      "MenuItem", "Movement", "Inventory", "Product", 
      "Schedule", "Attendance", "Employee", "UserRole", 
      "User", "Role", "Branch" CASCADE;`);
    console.log('✅ Existing data cleaned successfully');
  } catch (error) {
    console.log('ℹ️ No existing data to clean or tables not created yet');
  }

  // 2. Crear roles base
  console.log('🌱 Seeding roles...');
  const roles = await prisma.role.createMany({
    skipDuplicates: true,
    data: [
      {
        id: uuidv4(),
        name: 'SUPER_ADMIN',
        description: 'Administrador del sistema con todos los permisos',
        permissions: JSON.stringify(['*']),
      },
      {
        id: uuidv4(),
        name: 'MANAGER',
        description: 'Gerente de sucursal',
        permissions: JSON.stringify([
          'inventory:manage',
          'employees:view',
          'reports:generate',
          'orders:manage'
        ]),
      },
      {
        id: uuidv4(),
        name: 'CHEF',
        description: 'Chef de cocina',
        permissions: JSON.stringify([
          'orders:view',
          'inventory:view',
          'menu:manage'
        ]),
      },
      {
        id: uuidv4(),
        name: 'WAITER',
        description: 'Mesero',
        permissions: JSON.stringify([
          'orders:create',
          'orders:manage',
          'payments:process'
        ]),
      },
    ],
  });

  // 3. Crear usuarios base
  console.log('👥 Seeding users...');
  const superAdmin = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin@restaurante.com',
      name: 'Administrador Principal',
      password: hashedPassword,
      roles: {
        create: {
          role: {
            connect: {
              name: 'SUPER_ADMIN',
            },
          },
        },
      },
    },
  });

  // 4. Crear sucursales
  console.log('🏢 Seeding branches...');
  const branches = await prisma.branch.createMany({
    data: [
      {
        id: uuidv4(),
        name: 'Sucursal Centro',
        address: 'Av. Principal 123, Centro',
        phone: '555-100-2000',
        email: 'centro@restaurante.com',
        schedule: JSON.stringify({
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '23:00' },
          saturday: { open: '09:00', close: '23:00' },
          sunday: { open: '09:00', close: '22:00' },
        }),
      },
      {
        id: uuidv4(),
        name: 'Sucursal Norte',
        address: 'Calle Norte 456, Zona Norte',
        phone: '555-100-3000',
        email: 'norte@restaurante.com',
        schedule: JSON.stringify({
          monday: { open: '09:00', close: '23:00' },
          tuesday: { open: '09:00', close: '23:00' },
          wednesday: { open: '09:00', close: '23:00' },
          thursday: { open: '09:00', close: '23:00' },
          friday: { open: '09:00', close: '00:00' },
          saturday: { open: '10:00', close: '00:00' },
          sunday: { open: '10:00', close: '22:00' },
        }),
      },
      {
        id: uuidv4(),
        name: 'Sucursal Sur',
        address: 'Boulevard Sur 789, Zona Sur',
        phone: '555-100-4000',
        email: 'sur@restaurante.com',
        schedule: JSON.stringify({
          monday: { open: '10:00', close: '00:00' },
          tuesday: { open: '10:00', close: '00:00' },
          wednesday: { open: '10:00', close: '00:00' },
          thursday: { open: '10:00', close: '00:00' },
          friday: { open: '10:00', close: '01:00' },
          saturday: { open: '11:00', close: '01:00' },
          sunday: { open: '11:00', close: '23:00' },
        }),
      },
    ],
  });

  const [branchCentro, branchNorte, branchSur] = await prisma.branch.findMany();

  // 5. Crear empleados
  console.log('👨‍🍳 Seeding employees...');
  
  // Manager para sucursal centro
  const managerCentroUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'manager.centro@restaurante.com',
      name: 'Gerente Centro',
      password: hashedPassword,
      roles: {
        create: {
          role: {
            connect: {
              name: 'MANAGER',
            },
          },
        },
      },
    },
  });

  const managerCentro = await prisma.employee.create({
    data: {
      id: uuidv4(),
      userId: managerCentroUser.id,
      branchId: branchCentro.id,
      position: 'Gerente',
      salary: 2500,
      hiredDate: new Date('2023-01-15'),
    },
  });

  // Chef para sucursal centro
  const chefCentroUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'chef.centro@restaurante.com',
      name: 'Chef Principal Centro',
      password: hashedPassword,
      roles: {
        create: {
          role: {
            connect: {
              name: 'CHEF',
            },
          },
        },
      },
    },
  });

  const chefCentro = await prisma.employee.create({
    data: {
      id: uuidv4(),
      userId: chefCentroUser.id,
      branchId: branchCentro.id,
      position: 'Chef Ejecutivo',
      salary: 2200,
      hiredDate: new Date('2023-02-10'),
    },
  });

  // Mesero para sucursal centro
  const waiterCentroUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'mesero.centro@restaurante.com',
      name: 'Mesero Principal Centro',
      password: hashedPassword,
      roles: {
        create: {
          role: {
            connect: {
              name: 'WAITER',
            },
          },
        },
      },
    },
  });

  const waiterCentro = await prisma.employee.create({
    data: {
      id: uuidv4(),
      userId: waiterCentroUser.id,
      branchId: branchCentro.id,
      position: 'Mesero',
      salary: 1800,
      hiredDate: new Date('2023-03-05'),
    },
  });

  // 6. Crear productos
  console.log('🛒 Seeding products...');
  const products = await prisma.product.createMany({
    data: [
      { id: uuidv4(), name: 'Pechuga de pollo', description: 'Pechuga de pollo fresca', unit: 'kg', cost: 5.5, category: 'Carnes', barcode: '123456789012' },
      { id: uuidv4(), name: 'Carne de res', description: 'Corte premium de res', unit: 'kg', cost: 8.75, category: 'Carnes', barcode: '123456789013' },
      { id: uuidv4(), name: 'Leche entera', description: 'Leche entera pasteurizada', unit: 'l', cost: 1.2, category: 'Lácteos', barcode: '123456789014' },
      { id: uuidv4(), name: 'Tomate', description: 'Tomate rojo maduro', unit: 'kg', cost: 2.3, category: 'Verduras', barcode: '123456789015' },
      { id: uuidv4(), name: 'Cebolla', description: 'Cebolla blanca', unit: 'kg', cost: 1.8, category: 'Verduras', barcode: '123456789016' },
      { id: uuidv4(), name: 'Arroz', description: 'Arroz blanco grano largo', unit: 'kg', cost: 1.5, category: 'Granos', barcode: '123456789017' },
      { id: uuidv4(), name: 'Pasta', description: 'Pasta spaghetti', unit: 'kg', cost: 2.0, category: 'Granos', barcode: '123456789018' },
      { id: uuidv4(), name: 'Queso', description: 'Queso mozzarella', unit: 'kg', cost: 6.5, category: 'Lácteos', barcode: '123456789019' },
    ],
  });

  const allProducts = await prisma.product.findMany();

  // 7. Crear inventario
  console.log('📦 Seeding inventory...');
  for (const branch of [branchCentro, branchNorte, branchSur]) {
    for (const product of allProducts) {
      await prisma.inventory.create({
        data: {
          id: uuidv4(),
          branchId: branch.id,
          productId: product.id,
          quantity: product.name.includes('pollo') ? 20 : 
                   product.name.includes('res') ? 15 : 30,
          minStock: product.name.includes('pollo') ? 5 : 
                   product.name.includes('res') ? 3 : 10,
        },
      });
    }
  }

  // 8. Crear menú
  console.log('🍽️ Seeding menu items...');
  const menuItems = await prisma.menuItem.createMany({
    data: [
      {
        id: uuidv4(),
        name: 'Pollo a la Parrilla',
        description: 'Pechuga de pollo con especias acompañado de vegetales',
        price: 12.99,
        category: 'Platos Principales',
        branchId: branchCentro.id,
        imageUrl: 'https://ejemplo.com/pollo-parrilla.jpg'
      },
      {
        id: uuidv4(),
        name: 'Filete Mignon',
        description: 'Corte premium de carne de res con salsa especial',
        price: 24.99,
        category: 'Platos Principales',
        branchId: branchCentro.id,
        imageUrl: 'https://ejemplo.com/filete-mignon.jpg'
      },
      {
        id: uuidv4(),
        name: 'Ensalada César',
        description: 'Ensalada con pollo, croutones y aderezo césar',
        price: 8.99,
        category: 'Ensaladas',
        branchId: branchCentro.id,
        imageUrl: 'https://ejemplo.com/ensalada-cesar.jpg'
      },
      {
        id: uuidv4(),
        name: 'Pasta Alfredo',
        description: 'Pasta con salsa alfredo y pollo',
        price: 14.99,
        category: 'Pastas',
        branchId: branchCentro.id,
        imageUrl: 'https://ejemplo.com/pasta-alfredo.jpg'
      },
    ],
  });

  // 9. Crear recetas
  console.log('📝 Seeding recipes...');
  const polloParrilla = await prisma.menuItem.findFirst({ where: { name: 'Pollo a la Parrilla' } });
  const pechugaPollo = await prisma.product.findFirst({ where: { name: 'Pechuga de pollo' } });
  const tomate = await prisma.product.findFirst({ where: { name: 'Tomate' } });
  const cebolla = await prisma.product.findFirst({ where: { name: 'Cebolla' } });

  if (polloParrilla && pechugaPollo && tomate && cebolla) {
    await prisma.recipe.createMany({
      data: [
        {
          id: uuidv4(),
          menuItemId: polloParrilla.id,
          productId: pechugaPollo.id,
          quantity: 0.3,
          notes: '300g de pechuga por plato',
        },
        {
          id: uuidv4(),
          menuItemId: polloParrilla.id,
          productId: tomate.id,
          quantity: 0.1,
          notes: '100g de tomate por plato',
        },
        {
          id: uuidv4(),
          menuItemId: polloParrilla.id,
          productId: cebolla.id,
          quantity: 0.05,
          notes: '50g de cebolla por plato',
        },
      ],
    });
  }

  // 10. Crear órdenes de ejemplo
  console.log('🧾 Seeding sample orders...');
  const fileteMignon = await prisma.menuItem.findFirst({ where: { name: 'Filete Mignon' } });
  const ensaladaCesar = await prisma.menuItem.findFirst({ where: { name: 'Ensalada César' } });

  if (polloParrilla && fileteMignon && ensaladaCesar && waiterCentro) {
    await prisma.order.create({
      data: {
        id: uuidv4(),
        code: 'ORD-' + new Date().getTime(),
        branchId: branchCentro.id,
        tableNumber: 5,
        status: 'COMPLETED',
        total: 56.96,
        employeeId: waiterCentro.id,
        customer: 'Cliente Ejemplo',
        notes: 'Sin cebolla en la ensalada',
        items: {
          create: [
            {
              id: uuidv4(),
              menuItemId: polloParrilla.id,
              quantity: 1,
              unitPrice: 12.99,
              status: 'DELIVERED',
              notes: 'Bien cocido'
            },
            {
              id: uuidv4(),
              menuItemId: fileteMignon.id,
              quantity: 1,
              unitPrice: 24.99,
              status: 'DELIVERED',
              notes: 'Término medio'
            },
            {
              id: uuidv4(),
              menuItemId: ensaladaCesar.id,
              quantity: 2,
              unitPrice: 8.99,
              status: 'DELIVERED',
              notes: 'Sin croutones'
            },
          ],
        },
        payments: {
          create: [
            {
              id: uuidv4(),
              amount: 56.96,
              method: 'CREDIT_CARD',
              status: 'COMPLETED',
              employeeId: waiterCentro.id,
              notes: 'Tarjeta terminada en 4242'
            },
          ],
        },
      },
    });
  }

  // 11. Crear movimientos de inventario de ejemplo
  console.log('🔄 Seeding sample inventory movements...');
  if (pechugaPollo && chefCentro) {
    await prisma.movement.create({
      data: {
        id: uuidv4(),
        type: 'INGRESS',
        productId: pechugaPollo.id,
        quantity: 10,
        employeeId: chefCentro.id,
        notes: 'Compra semanal de pollo',
        reference: 'FAC-001'
      }
    });
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });