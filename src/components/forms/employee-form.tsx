'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { employeeFormSchema, EmployeeFormValues } from '@/lib/validations/employee'
import type { Employee, Branch } from '@/lib/types'
import { createEmployee, updateEmployee } from '@/lib/api/employees'

interface EmployeeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branches: Branch[]
  currentUserBranchId?: string
  employee?: Employee
}

export function EmployeeForm({
  open,
  onOpenChange,
  branches,
  currentUserBranchId,
  employee,
}: EmployeeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: employee?.user.name || '',
      email: employee?.user.email || '',
      phone: employee?.user.phone || '',
      position: employee?.position || '',
      salary: employee?.salary || 0,
      branchId: employee?.branchId || currentUserBranchId || '',
      hiredDate: employee?.hiredDate.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      isActive: employee?.isActive ?? true
    }
  })

  const filteredBranches = currentUserBranchId
    ? branches.filter(b => b.id === currentUserBranchId)
    : branches

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsLoading(true)
    try {
      const employeeData = {
        user: {
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
        },
        position: data.position,
        salary: data.salary,
        branchId: data.branchId,
        hiredDate: new Date(data.hiredDate),
        isActive: data.isActive
      }

      if (employee) {
        await updateEmployee(employee.id, employeeData)
        toast({
          title: 'Éxito',
          description: 'Empleado actualizado correctamente',
        })
      } else {
        await createEmployee(employeeData)
        toast({
          title: 'Éxito',
          description: 'Empleado creado correctamente',
        })
      }

      router.refresh()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Editar Empleado' : 'Nuevo Empleado'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="juan@empresa.com" 
                        type="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+57 123 456 7890" 
                        type="tel"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Gerente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000000"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hiredDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Contratación</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sucursal</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!!currentUserBranchId && !employee}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una sucursal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredBranches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {employee && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">
                        {field.value ? 'Activo' : 'Inactivo'}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    {employee ? 'Actualizando...' : 'Creando...'}
                  </span>
                ) : employee ? (
                  'Actualizar Empleado'
                ) : (
                  'Crear Empleado'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}