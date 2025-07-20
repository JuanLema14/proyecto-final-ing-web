import { auth } from "./auth";
import { prisma } from "./db";

export async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: { include: { role: true } },
      employee: { include: { branch: true } },
    },
  });

  if (!user) throw new Error("Usuario no encontrado");

  return user;
}

