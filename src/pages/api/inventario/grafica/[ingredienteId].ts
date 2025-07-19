// /src/pages/api/inventario/grafica/[ingredienteId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/config/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'No estás autorizado.' });
  }

  const { ingredienteId } = req.query;
  const { sucursalId } = req.query; // Opcional: filtrar por sucursal

  if (!ingredienteId || typeof ingredienteId !== 'string' || isNaN(parseInt(ingredienteId))) {
    return res.status(400).json({ message: 'El ID del ingrediente es inválido.' });
  }

  if (req.method === 'GET') {
    try {
      // Verificar que el ingrediente existe
      const ingrediente = await prisma.ingrediente.findUnique({
        where: { id: parseInt(ingredienteId) }
      });

      if (!ingrediente) {
        return res.status(404).json({ message: 'Ingrediente no encontrado.' });
      }

      // Construir filtros para la consulta
      const filtros: any = {
        idIngrediente: parseInt(ingredienteId),
      };

      if (sucursalId && !isNaN(parseInt(sucursalId as string))) {
        filtros.idSucursal = parseInt(sucursalId as string);
      }

      // Obtener movimientos históricos
      const movimientos = await prisma.movimiento.findMany({
        where: filtros,
        orderBy: {
          creadoEn: 'asc',
        },
        include: {
          sucursal: {
            select: { nombre: true }
          },
          usuario: {
            select: { nombre: true, email: true }
          }
        }
      });

      if (movimientos.length === 0) {
        return res.status(200).json({
          ingrediente: ingrediente.nombre,
          unidadMedida: ingrediente.unidadMedida,
          datos: [],
          mensaje: 'No hay movimientos registrados para este ingrediente.'
        });
      }

      // Procesar los datos para la gráfica
      let stockAcumulado = 0;
      const datosGrafica = movimientos.map((mov) => {
        if (mov.tipo === 'ENTRADA') {
          stockAcumulado += Number(mov.cantidad);
        } else {
          stockAcumulado -= Number(mov.cantidad);
        }
        
        return {
          fecha: mov.creadoEn.toISOString().split('T')[0], // YYYY-MM-DD
          fechaCompleta: mov.creadoEn.toISOString(),
          stock: stockAcumulado,
          movimiento: {
            tipo: mov.tipo,
            cantidad: Number(mov.cantidad),
            sucursal: mov.sucursal.nombre,
            usuario: mov.usuario.nombre || mov.usuario.email,
          }
        };
      });

      return res.status(200).json({
        ingrediente: ingrediente.nombre,
        unidadMedida: ingrediente.unidadMedida,
        stockActual: stockAcumulado,
        totalMovimientos: movimientos.length,
        datos: datosGrafica,
      });
    } catch (error) {
      console.error('Error al obtener los datos para la gráfica de inventario:', error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}