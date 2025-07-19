import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/config/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = await prisma.usuario.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'El correo ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        // Añade esta línea para verificar en la consola del servidor
        console.log('Contraseña original:', password);
        console.log('Contraseña encriptada (Hash):', hashedPassword);

        const clienteRol = await prisma.rol.findUnique({
            where: { nombreRol: 'Cliente' },
        });

        if (!clienteRol) {
            return res.status(500).json({ message: 'El rol de Cliente no se encuentra configurado.' });
        }

        const user = await prisma.usuario.create({
            data: {
                email,
                hashContrasena: hashedPassword,
                roles: {
                    create: [{ idRol: clienteRol.id }],
                },
            },
        });

        return res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({ message: 'Ocurrió un error en el servidor.' });
    }
}