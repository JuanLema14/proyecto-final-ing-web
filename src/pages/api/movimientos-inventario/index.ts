// /src/pages/api/movimientos-inventario/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/config/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'No estás autorizado.' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { idSucursal, idIngrediente, cantidad, tipoMovimiento } = req.body;
    const userId = parseInt(session.user.id);

    if (!idSucursal || !idIngrediente || !cantidad || !tipoMovimiento) {
      return res.status(400).json({ 
        message: 'Faltan datos requeridos: idSucursal, idIngrediente, cantidad, tipoMovimiento.' 
      });
    }

    if (tipoMovimiento !== 'ENTRADA' && tipoMovimiento !== 'SALIDA') {
      return res.status(400).json({ 
        message: "El tipo de movimiento debe ser 'ENTRADA' o 'SALIDA'." 
      });
    }

    // Usamos una transacción para asegurar consistencia
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el inventario
      const inventarioActualizado = await tx.inventarioSucursal.upsert({
        where: {
          idSucursal_idIngrediente: {
            idSucursal: Number(idSucursal),
            idIngrediente: Number(idIngrediente),
          },
        },
        update: {
          stockActual: {
            [tipoMovimiento === 'ENTRADA' ? 'increment' : 'decrement']: Number(cantidad),
          },
        },
        create: {
          idSucursal: Number(idSucursal),
          idIngrediente: Number(idIngrediente),
          stockActual: tipoMovimiento === 'ENTRADA' ? Number(cantidad) : -Number(cantidad),
          stockMinimo: 0,
        },
      });

      // 2. Registrar el movimiento histórico
      const movimientoCreado = await tx.movimiento.create({
        data: {
          idSucursal: Number(idSucursal),
          idIngrediente: Number(idIngrediente),
          tipo: tipoMovimiento,
          cantidad: Number(cantidad),
          idUsuario: userId,
        },
      });

      return {
        inventario: inventarioActualizado,
        movimiento: movimientoCreado,
      };
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al procesar el movimiento de inventario:", error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
}