import { CreateEmployeeInput, Employee } from "@/lib/types";
import { prisma } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";

export async function getEmployees(): Promise<Employee[]> {
  try {
    console.log("Fetching employees from API...");
    const session = await auth();
    if (!session?.user) throw new Error("No autenticado");

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: { role: true },
        },
        employee: {
          include: {
            branch: true,
          },
        },
      },
    });

    const role = user?.roles?.[0]?.role?.name;

    if (!role) {
      throw new Error("No tienes roles asignados");
    }

    const isAdmin = role === "SUPER_ADMIN";
    const isManager = role === "GERENTE_SUCURSAL";

    if (!isAdmin && !isManager) {
      throw new Error("No tienes permisos para ver empleados");
    }

    const userBranchId = user?.employee?.branchId;

    const employees = await prisma.employee.findMany({
      include: {
        user: true,
        branch: true,
      },
      where: isAdmin
        ? {}
        : {
            branchId: userBranchId,
          },
    });

    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}

export async function getEmployee(id: string): Promise<Employee> {
  const response = await fetch(`/api/employees/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch employee");
  }

  return response.json();
}

export async function createEmployee(data: CreateEmployeeInput): Promise<Employee> {
  const response = await fetch(`/api/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || error.error || "Error al crear empleado")
  }

  return response.json()
}


export async function updateEmployee(
  id: string,
  data: Partial<Employee>
): Promise<Employee> {
  const response = await fetch(`/api/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update employee");
  }

  return response.json();
}

export async function deactivateEmployee(id: string): Promise<void> {
  const response = await fetch(`/api/employees/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to deactivate employee");
  }
}
