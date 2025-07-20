import './globals.css'
import AuthProvider from '@/app/providers/auth-provider'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Mi App',
  description: 'Ejemplo NextAuth con credenciales',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Toaster richColors position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
