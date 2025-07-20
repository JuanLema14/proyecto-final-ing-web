'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast' // Cambiado de '@/components/ui/toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { getBranches } from '@/lib/api/branches'
import { Branch, Employee } from '@/lib/types'
import { useEffect, useState } from 'react'

// Esquema corregido
const employeeSchema = z.object({
  userId: z.string().optional(),
  branchId: z.string().min(1, {
    message: 'Debe seleccionar una sucursal',
  }),
  position: z.string().min(2, {
    message: 'El cargo debe tener al menos 2 caracteres',
  }),
  salary: z.number().min(0, {
    message: 'El salario no puede ser negativo',
  }),
  hiredDate: z.date({
    required_error: 'La fecha de contratación es requerida',
  }),
  isActive: z.boolean().default(true),
})

// Tipo inferido del esquema
type EmployeeFormValues = z.infer<typeof employeeSchema>

export function EmployeeForm({ initialData }: { initialData?: Partial<Employee> }) {
  const router = useRouter()
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getBranches()
        setBranches(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las sucursales',
          variant: 'destructive',
        })
      }
    }
    
    fetchBranches()
  }, [])

  // Formulario con tipos explícitos
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      branchId: initialData?.branchId || '',
      position: initialData?.position || '',
      salary: initialData?.salary || 0,
      hiredDate: initialData?.hiredDate ? new Date(initialData.hiredDate) : new Date(),
      isActive: initialData?.isActive ?? true,
      userId: initialData?.userId,
    },
  })

  const onSubmit = async (values: EmployeeFormValues) => {
    setLoading(true)
    try {
      if (initialData?.id) {
        await updateEmployee(initialData.id, values)
        toast({
          title: 'Éxito',
          description: 'Empleado actualizado correctamente',
        })
      } else {
        await createEmployee(values)
        toast({
          title: 'Éxito',
          description: 'Empleado creado correctamente',
        })
      }
      router.push('/employees')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Ocurrió un error',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ... (el resto del formulario permanece igual) ... */}
      </form>
    </Form>
  )
}