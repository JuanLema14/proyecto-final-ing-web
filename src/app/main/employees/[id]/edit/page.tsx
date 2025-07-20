import { EmployeeForm } from '@/components/forms/employee-form'
import { getEmployee } from '@/lib/api/employees'
import { getBranches } from '@/lib/api/branches'
import { notFound } from 'next/navigation'

export default async function EditEmployeePage({
  params,
}: {
  params: { id: string }
}) {
  const [employee, branches] = await Promise.all([
    getEmployee(params.id),
    getBranches(),
  ])

  if (!employee) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Empleado</h1>
      </div>
      
      <EmployeeForm initialData={employee} branches={branches} />
    </div>
  )
}