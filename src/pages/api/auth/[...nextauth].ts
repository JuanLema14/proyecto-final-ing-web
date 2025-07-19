import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/config/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashContrasena) return null;

        const isValidPassword = await bcrypt.compare(credentials.password, user.hashContrasena);
        if (!isValidPassword) return null;

        return { id: user.id, email: user.email, name: user.nombre };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userWithRoles = await prisma.usuario.findUnique({
          where: { id: user.id },
          include: { roles: { include: { rol: true } } },
        });

        if (userWithRoles && userWithRoles.roles.length > 0) {
          token.id = user.id;
          token.rol = userWithRoles.roles[0].rol.nombreRol;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.rol = token.rol;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);