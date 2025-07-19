// /src/pages/api/categorias-menu/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/config/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'No estás autorizado.' });
  }

  const userRole = session.user?.rol;

  switch (req.method) {
    case 'GET':
      // Cualquier usuario logueado puede ver las categorías
      try {
        const categorias = await prisma.categoriaMenu.findMany({
          orderBy: {
            nombre: 'asc',
          },
        });
        return res.status(200).json(categorias);
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Error al obtener las categorías.' });
      }

    case 'POST':
      // Solo Admin o Gerente pueden crear categorías
      if (userRole !== 'Administrador General' && userRole !== 'Gerente') {
        return res.status(403).json({
          message: 'Acceso denegado. Se requiere rol de Administrador o Gerente.',
        });
      }

      try {
        const { nombre, descripcion } = req.body;
        if (!nombre) {
          return res
            .status(400)
            .json({ message: 'El campo "nombre" es requerido.' });
        }

        const nuevaCategoria = await prisma.categoriaMenu.create({
          data: {
            nombre,
            descripcion,
          },
        });
        return res.status(201).json(nuevaCategoria);
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Error al crear la categoría.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}