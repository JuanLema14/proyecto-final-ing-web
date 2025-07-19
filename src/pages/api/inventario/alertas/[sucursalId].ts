import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/config/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'No estás autorizado.' });
  }

  const { sucursalId } = req.query;

  if (!sucursalId || typeof sucursalId !== 'string' || isNaN(parseInt(sucursalId))) {
    return res.status(400).json({ message: 'El ID de la sucursal es inválido.' });
  }

  if (req.method === 'GET') {
    try {
      const alertasInventario = await prisma.inventarioSucursal.findMany({
        where: {
          idSucursal: parseInt(sucursalId),
          // La condición clave: el stock actual es menor o igual al mínimo.
          stockActual: {
            lte: prisma.inventarioSucursal.fields.stockMinimo,
          },
        },
        include: {
          ingrediente: true, // Incluimos los datos del ingrediente para más contexto
        },
      });

      return res.status(200).json(alertasInventario);
    } catch (error) {
      console.error("Error al obtener las alertas de inventario:", error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}