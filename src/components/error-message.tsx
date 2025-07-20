import { AlertTriangle, Lock, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  type?: 'error' | 'warning' | 'info' | 'restricted'
  title: string
  message: string
  className?: string
}

export function ErrorMessage({ 
  type = 'error', 
  title, 
  message, 
  className 
}: ErrorMessageProps) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    restricted: 'bg-purple-50 border-purple-200 text-purple-800'
  }

  const icons = {
    error: <AlertTriangle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    restricted: <Lock className="h-5 w-5" />
  }

  return (
    <div className={cn(
      'rounded-lg border p-4',
      styles[type],
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[type]}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  )
}