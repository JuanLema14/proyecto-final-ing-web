// /src/pages/api/categorias-menu/[id].ts
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
  if (userRole !== 'Administrador General' && userRole !== 'Gerente') {
    return res.status(403).json({
      message: 'Acceso denegado. Se requiere rol de Administrador o Gerente.',
    });
  }

  const { id } = req.query;
  const categoriaId = parseInt(id as string);

  if (isNaN(categoriaId)) {
    return res.status(400).json({ message: 'El ID de la categoría es inválido.' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { nombre, descripcion } = req.body;
        const categoriaActualizada = await prisma.categoriaMenu.update({
          where: { id: categoriaId },
          data: { nombre, descripcion },
        });
        return res.status(200).json(categoriaActualizada);
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Error al actualizar la categoría.' });
      }

    case 'DELETE':
      try {
        await prisma.categoriaMenu.delete({
          where: { id: categoriaId },
        });
        return res.status(204).end(); // 204 No Content
      } catch (error) {
        // Manejar el caso en que la categoría no se puede borrar porque tiene items asociados
        return res.status(500).json({
          message:
            'Error al eliminar la categoría. Asegúrate de que no tenga platos asociados.',
        });
      }

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}