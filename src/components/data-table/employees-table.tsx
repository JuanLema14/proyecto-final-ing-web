'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Eye, Power } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/ui/data-table/data-table'
import { useRouter } from 'next/navigation'
import { Employee } from '@/lib/types'
import { deactivateEmployee, updateEmployee } from '@/lib/api/employees'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'user',
    header: 'Empleado',
    cell: ({ row }) => {
      const employee = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-white">
              {employee.user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{employee.user.name}</p>
            <p className="text-sm text-gray-500">{employee.position}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'user.email',
    header: 'Contacto',
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="text-blue-600 hover:underline">{row.original.user.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'branch.name',
    header: 'Sucursal',
    cell: ({ row }) => (
      <Badge variant="outline" className="text-gray-700">
        {row.original.branch.name}
      </Badge>
    ),
  },
  {
    accessorKey: 'hiredDate',
    header: 'Fecha de Ingreso',
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {format(new Date(row.original.hiredDate), 'PPP', { locale: es })}
      </div>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge
        variant={row.original.isActive ? 'default' : 'destructive'}
        className={cn(
          'px-3 py-1 rounded-full text-xs font-medium',
          row.original.isActive
            ? 'bg-green-50 text-green-700 hover:bg-green-50'
            : 'bg-red-50 text-red-700 hover:bg-red-50'
        )}
      >
        {row.original.isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const employee = row.original
      const router = useRouter()

      const handleDeactivate = async () => {
        try {
          if (!employee.isActive) {
            throw new Error('El empleado ya está inactivo')
          }
          await deactivateEmployee(employee.id)
          toast.info('Empleado actualizado correctamente')
          router.refresh()
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Ocurrió un error')
        }
      }
      const handleActivate = async () => {
        try {
          if (employee.isActive) {
            throw new Error('El empleado ya está activo')
          }
          await updateEmployee(employee.id, { isActive: true })
          toast.info('Empleado actualizado correctamente')
          router.refresh()
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Ocurrió un error')
        }
      }

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                <span className="sr-only text-grey-700">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg">
              <DropdownMenuLabel className='text-gray-700'>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={cn(
                  "cursor-pointer",
                  employee.isActive ? "text-red-600" : "text-green-600"
                )}
                onClick={employee.isActive ? handleDeactivate : handleActivate}
              >
                <Power className="mr-2 h-4 w-4" />
                {employee.isActive ? 'Desactivar' : 'Activar'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

interface EmployeesTableProps {
  data: Employee[]
}

export function EmployeesTable({ data }: EmployeesTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data}
      className="border rounded-lg shadow-sm"
    />
  )
}