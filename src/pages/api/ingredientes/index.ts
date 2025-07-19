// /src/pages/api/ingredientes/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/config/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'No estás autorizado.' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const ingredientes = await prisma.ingrediente.findMany();
        return res.status(200).json(ingredientes);
      } catch (error) {
        console.error("Error al obtener los ingredientes:", error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }

    case 'POST':
      // Verificamos que solo el Administrador General pueda crear ingredientes
      if (session.user?.rol !== 'Administrador General') {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de Administrador.' });
      }

      try {
        const { nombre, unidadMedida } = req.body;

        if (!nombre || !unidadMedida) {
          return res.status(400).json({ message: 'El nombre y la unidad de medida son requeridos.' });
        }

        const nuevoIngrediente = await prisma.ingrediente.create({
          data: {
            nombre,
            unidadMedida,
          },
        });
        return res.status(201).json(nuevoIngrediente);
      } catch (error) {
        console.error("Error al crear el ingrediente:", error);
        // Manejar error de ingrediente duplicado
        if (error.code === 'P2002') {
          return res.status(409).json({ message: 'Ya existe un ingrediente con ese nombre.' });
        }
        return res.status(500).json({ message: 'Error al crear el ingrediente.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}