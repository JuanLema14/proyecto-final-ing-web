// app/layout.tsx
import './globals.css'
import AuthProvider from '@/app/providers/auth-provider'

export const metadata = {
  title: 'Mi App',
  description: 'Ejemplo NextAuth con credenciales',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
