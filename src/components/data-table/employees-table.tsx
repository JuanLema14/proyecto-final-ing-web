'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/ui/data-table/data-table'
import { useRouter } from 'next/navigation'
import { Employee } from '@/lib/types'
import { deactivateEmployee } from '@/lib/api/employees'
import { toast } from '@/components/ui/toast'

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'user.name',
    header: 'Nombre',
    cell: ({ row }) => <div className="font-medium">{row.original.user.name}</div>,
  },
  {
    accessorKey: 'user.email',
    header: 'Email',
    cell: ({ row }) => <div className="text-blue-600">{row.original.user.email}</div>,
  },
  {
    accessorKey: 'position',
    header: 'Cargo',
  },
  {
    accessorKey: 'branch.name',
    header: 'Sucursal',
  },
  {
    accessorKey: 'isActive',
    header: 'Estado',
    cell: ({ row }) => (
      <span className={cn(
        'px-2 py-1 rounded-full text-xs',
        row.original.isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      )}>
        {row.original.isActive ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const employee = row.original
      const router = useRouter()

      const handleDeactivate = async () => {
        try {
          await deactivateEmployee(employee.id)
          toast({
            title: 'Éxito',
            description: `Empleado ${employee.isActive ? 'desactivado' : 'activado'} correctamente`,
          })
          router.refresh()
        } catch (error) {
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Ocurrió un error',
            variant: 'destructive',
          })
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/employees/${employee.id}`)}
            >
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/employees/${employee.id}/edit`)}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={handleDeactivate}
            >
              {employee.isActive ? 'Desactivar' : 'Activar'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface EmployeesTableProps {
  data: Employee[]
}

export function EmployeesTable({ data }: EmployeesTableProps) {
  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}