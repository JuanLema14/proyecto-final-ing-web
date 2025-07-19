import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "No estás autorizado." });
  }

  if (session.user?.rol !== "Administrador General") {
    return res.status(403).json({ message: "Acceso denegado." });
  }

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "ID de sucursal inválido." });
  }

  function restarCincoHoras(fecha: Date): Date {
    const ajustada = new Date(fecha);
    ajustada.setHours(ajustada.getHours() - 5);
    return ajustada;
  }

  switch (req.method) {
    case "GET":
      try {
        const sucursal = await prisma.sucursal.findUnique({
          where: { id: parseInt(id) },
        });

        if (!sucursal) {
          return res.status(404).json({ message: "Sucursal no encontrada." });
        }

        return res.status(200).json(sucursal);
      } catch (error) {
        console.error("Error al obtener la sucursal:", error);
        return res
          .status(500)
          .json({ message: "Error al obtener la sucursal." });
      }

    case "PUT":
      try {
        const data = req.body;
        const sucursalActualizada = await prisma.sucursal.update({
          where: { id: parseInt(id) },
          data: {
            nombre: data.nombre,
            direccion: data.direccion,
            ciudad: data.ciudad,
            telefono: data.telefono,
            emailContacto: data.emailContacto,
            horaApertura: restarCincoHoras(new Date(data.horaApertura)),
            horaCierre: restarCincoHoras(new Date(data.horaCierre)),
            estaActiva: data.estaActiva,
          },
        });
        return res.status(200).json(sucursalActualizada);
      } catch (error) {
        console.error("Error al actualizar la sucursal:", error);
        return res
          .status(500)
          .json({ message: "Error al actualizar la sucursal." });
      }

    case "DELETE":
      try {
        await prisma.sucursal.delete({
          where: { id: parseInt(id) },
        });
        return res.status(204).end();
      } catch (error) {
        console.error("Error al eliminar la sucursal:", error);
        return res
          .status(500)
          .json({ message: "Error al eliminar la sucursal." });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
