const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Crear sucursal
  const sucursal = await prisma.sucursal.create({
    data: {
      nombre: "Sucursal Central",
      direccion: "Calle 123 #45-67",
      ciudad: "Bogotá",
      telefono: "3001234567",
      emailContacto: "central@sucursal.com",
      horaApertura: new Date("1970-01-01T08:00:00"),
      horaCierre: new Date("1970-01-01T20:00:00"),
    },
  });

  // Obtener roles
  const roles = await prisma.rol.findMany();
  const rolesMap: Record<string, number> = {};
  roles.forEach((r) => {
    rolesMap[r.nombreRol] = r.id;
  });

  // Usuarios y asignación de roles
  const usuarios = await Promise.all(
    [
      {
        nombre: "Camilo",
        apellido: "Admin",
        email: "admin@demo.com",
        rol: "Administrador General",
      },
      {
        nombre: "Gina",
        apellido: "Chef",
        email: "chef@demo.com",
        rol: "Chef",
      },
      {
        nombre: "Laura",
        apellido: "Mesera",
        email: "mesera@demo.com",
        rol: "Mesero",
      },
      {
        nombre: "David",
        apellido: "Cliente",
        email: "cliente@demo.com",
        rol: "Cliente",
      },
    ].map(async ({ nombre, apellido, email, rol }) => {
      const user = await prisma.usuario.create({
        data: {
          nombre,
          apellido,
          email,
          hashContrasena: await bcrypt.hash("123456", 10),
          idSucursal: sucursal.id,
        },
      });

      await prisma.usuarioRol.create({
        data: {
          idUsuario: user.id,
          idRol: rolesMap[rol],
        },
      });

      return user;
    })
  );

  // Crear mesas
  await prisma.mesa.createMany({
    data: [
      { numeroMesa: "A1", capacidad: 4, idSucursal: sucursal.id },
      { numeroMesa: "A2", capacidad: 2, idSucursal: sucursal.id },
      { numeroMesa: "B1", capacidad: 6, idSucursal: sucursal.id },
    ],
  });

  // Crear categoría e ítems del menú
  const categoria = await prisma.categoriaMenu.create({
    data: {
      nombre: "Entradas",
      descripcion: "Entradas deliciosas",
    },
  });

  const item1 = await prisma.itemMenu.create({
    data: {
      nombre: "Empanadas",
      descripcion: "Empanadas de carne",
      precio: 8000,
      idCategoria: categoria.id,
    },
  });

  await prisma.sucursalItemMenu.create({
    data: {
      idItemMenu: item1.id,
      idSucursal: sucursal.id,
    },
  });

  const ingrediente = await prisma.ingrediente.create({
    data: {
      nombre: "Carne molida",
      unidadMedida: "g",
    },
  });

  await prisma.receta.create({
    data: {
      idIngrediente: ingrediente.id,
      idItemMenu: item1.id,
      cantidadRequerida: 150,
    },
  });

  await prisma.inventarioSucursal.create({
    data: {
      idIngrediente: ingrediente.id,
      idSucursal: sucursal.id,
      stockActual: 2000,
      stockMinimo: 500,
    },
  });

  console.log("✅ ¡Datos dummy insertados!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
