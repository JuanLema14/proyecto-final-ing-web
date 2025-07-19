import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/config/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'No estás autorizado.' });
  }

  const { sucursalId } = req.query;

  if (!sucursalId || typeof sucursalId !== 'string' || isNaN(parseInt(sucursalId))) {
    return res.status(400).json({ message: 'El ID de la sucursal es inválido.' });
  }

  const idSucursal = parseInt(sucursalId);

  if (req.method === 'GET') {
    try {
      const inventario = await prisma.inventarioSucursal.findMany({
        where: { idSucursal },
        include: { ingrediente: true },
      });

      return res.status(200).json(inventario);
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { idIngrediente, stockActual, stockMinimo } = req.body;

      if (
        !idIngrediente ||
        typeof idIngrediente !== 'number' ||
        typeof stockActual !== 'number' ||
        typeof stockMinimo !== 'number'
      ) {
        return res.status(400).json({ message: 'Datos inválidos en el cuerpo de la solicitud.' });
      }

      const now = new Date();

      // Upsert: actualiza si ya existe la relación, o la crea si no
      const inventario = await prisma.inventarioSucursal.upsert({
        where: {
          idSucursal_idIngrediente: {
            idSucursal,
            idIngrediente,
          },
        },
        update: {
          stockActual,
          stockMinimo,
          ultimaActualizacion: now,
        },
        create: {
          idSucursal,
          idIngrediente,
          stockActual,
          stockMinimo,
          ultimaActualizacion: now,
        },
      });

      return res.status(200).json({ message: 'Inventario actualizado correctamente.', inventario });
    } catch (error) {
      console.error('Error al actualizar/crear inventario:', error);
      return res.status(500).json({ message: 'Error al guardar inventario.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
