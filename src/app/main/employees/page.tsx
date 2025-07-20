import { EmployeesTable } from "@/components/data-table/employees-table"
import { getEmployees, getEmployee } from "@/lib/api/employees"
import { auth } from "@/app/lib/auth"
import { redirect } from "next/navigation"
import { ErrorMessage } from "@/components/error-message"
import { getBranches } from "@/lib/api/branches"
import { prisma } from "@/app/lib/db"
import { EmployeeFormTrigger } from "@/components/forms/employee-form-trigger";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: { edit?: string }
}) {
  const session = await auth()

  if (!session?.user) {
    return redirect("/login")
  }

  try {
    const [employees, branches] = await Promise.all([
      getEmployees(),
      getBranches(),
    ])

    // Obtener la sucursal del usuario actual si no es admin
    let currentUserBranchId: string | undefined
    if (session.user.role !== "SUPER_ADMIN") {
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { employee: true },
      })
      currentUserBranchId = currentUser?.employee?.branchId
    }

    // Obtener empleado a editar si hay ID en searchParams
    const employeeToEdit = searchParams.edit
      ? await getEmployee(searchParams.edit)
      : undefined

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Gestión de Empleados</h1>
          <EmployeeFormTrigger 
            branches={branches}
            currentUserBranchId={currentUserBranchId}
            employee={employeeToEdit}
          />
        </div>
        <EmployeesTable data={employees} />
      </div>
    )
  } catch (error: any) {
    console.error("Error al cargar empleados:", error)

    if (error.message === "Unauthorized") {
      return redirect("/main?error=unauthorized")
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
    )
  }
}