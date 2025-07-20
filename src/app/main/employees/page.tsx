import { EmployeesTable } from "@/components/data-table/employees-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getEmployees } from "@/lib/api/employees";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

import { ErrorMessage } from "@/components/error-message";
import { console } from "inspector";

export default async function EmployeesPage() {
  console.log("Cargando empleados...");
  const session = await auth();

  if (!session?.user) {
    console.error("Usuario no autenticado, redirigiendo a login");
    return redirect("/login");
  }

  try {
    const employees = await getEmployees();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Gestión de Empleados</h1>
          <Button asChild>
            <Link href="/main/employees/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Link>
          </Button>
        </div>

        <EmployeesTable data={employees} />
      </div>
    );
  } catch (error: any) {
    console.error("Error al cargar empleados:", error);

    if (error.message === "Unauthorized") {
      return redirect("/main?error=unauthorized");
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Gestión de Empleados</h1>
        </div>

        <ErrorMessage
          type={
            error.message.includes("permisos")
              ? "restricted"
              : error.message.includes("Error")
              ? "error"
              : "warning"
          }
          title={
            error.message.includes("permisos")
              ? "Acceso restringido"
              : "Error al cargar empleados"
          }
          message={error.message}
        />
      </div>
    );
  }
}
