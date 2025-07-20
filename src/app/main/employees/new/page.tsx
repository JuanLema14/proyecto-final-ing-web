import { EmployeeForm } from '@/components/forms/employee-form'
import { getBranches } from '@/lib/api/branches'
import { auth } from '@/app/lib/auth'

export default async function NewEmployeePage() {
  const session = await auth()
  const branches = await getBranches()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nuevo Empleado</h1>
      </div>
      
      <EmployeeForm branches={branches} />
    </div>
  )
}