import { prisma } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { Branch, BranchFormData } from "../types";

export async function getBranches() {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");

  const userId = session.user.id;

  const roles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });

  const roleNames = roles.map((r) => r.role.name);

  if (roleNames.includes("SUPER_ADMIN")) {
    return prisma.branch.findMany({
      orderBy: { name: "asc" },
      include: { inventory: true },
    });
  }

  const employee = await prisma.employee.findUnique({
    where: { userId },
    include: { branch: { include: { inventory: true } } },
  });

  if (!employee) throw new Error("No asignado como empleado");

  return [employee.branch];
}

export async function getBranchById(id: string): Promise<Branch> {
  const response = await fetch(`/api/branches/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch branch");
  }
  return response.json();
}

export async function createBranch(data: BranchFormData): Promise<Branch> {
  try {
    console.log("Enviando datos a /api/branches:", data);
    const response = await fetch('/api/branches', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("Error en la respuesta:", result);
      throw new Error(result.error || "Failed to create branch");
    }

    return result;
    
  } catch (error) {
    console.error("Error en createBranch:", error);
    throw error;
  }
}

export async function updateBranch(id: string, data: Partial<BranchFormData>): Promise<Branch> {
  const response = await fetch(`/api/branches/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update branch');
  }

  return response.json();
}

