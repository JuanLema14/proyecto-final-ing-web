// /src/pages/api/sucursales/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/config/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'; // Importa tus authOptions

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Obtenemos la sesión para verificar el rol del usuario
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'No estás autorizado.' });
  }

  function restarCincoHoras(fecha: Date): Date {
    const ajustada = new Date(fecha);
    ajustada.setHours(ajustada.getHours() - 5);
    return ajustada;
  }

  switch (req.method) {
    case 'GET':
      try {
        const sucursales = await prisma.sucursal.findMany();
        return res.status(200).json(sucursales);
      } catch (error) {
        console.error("Error al obtener las sucursales:", error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }

    case 'POST':
      if (session.user?.rol !== 'Administrador General') {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de Administrador.' });
      }

      try {
        const data = req.body;
        // CORRECCIÓN: Prisma puede manejar el formato ISO directamente.
        // Eliminamos la conversión new Date().
        const nuevaSucursal = await prisma.sucursal.create({
          data: {
            nombre: data.nombre,
            direccion: data.direccion,
            ciudad: data.ciudad,
            telefono: data.telefono,
            emailContacto: data.emailContacto,
            horaApertura: restarCincoHoras(new Date(data.horaApertura)),
            horaCierre: restarCincoHoras(new Date(data.horaCierre)),
          },
        });
        return res.status(201).json(nuevaSucursal);
      } catch (error) {
        console.error("Error al crear la sucursal:", error);
        return res.status(500).json({ message: 'Error al crear la sucursal.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}