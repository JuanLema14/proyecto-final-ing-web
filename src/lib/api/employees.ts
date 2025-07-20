import { Employee } from "@/lib/types";

// Función auxiliar para obtener la URL base
const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // Navegador usa URL relativa
  if (process.env.NEXTAUTH_URL) return `${process.env.NEXTAUTH_URL}`; // SSR en Vercel
  return `http://localhost:${process.env.PORT ?? 3000}`; // SSR local
};

export async function getEmployees(): Promise<Employee[]> {
  try {
    const baseUrl = getBaseUrl();
    console.log(`----? Fetching employees from ${baseUrl}`);
    const response = await fetch(`${baseUrl}/api/employees`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch employees')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}

export async function getEmployee(id: string): Promise<Employee> {
  const baseUrl = getBaseUrl();
  console.log(`----? Fetching employee`, baseUrl);
  const response = await fetch(`${baseUrl}/api/employees/${id}`, {
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

export async function createEmployee(
  data: Omit<Employee, "id">
): Promise<Employee> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || error.error || "Failed to create employee"
    );
  }

  return response.json();
}

export async function updateEmployee(
  id: string,
  data: Partial<Employee>
): Promise<Employee> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/employees/${id}`, {
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
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/employees/${id}`, {
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
