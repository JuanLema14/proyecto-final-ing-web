// /src/pages/index.tsx
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function HomePage() {
  const { data: session, status } = useSession();

  // Muestra un skeleton mientras se carga
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-[125px] w-full rounded-xl" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Si no hay sesión
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="text-center space-y-6 max-w-md">
          <Icons.logo className="mx-auto h-16 w-16" />
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido a TiendaUdea</h1>
          <p className="text-gray-600">
            Por favor inicia sesión para acceder al sistema de gestión de sucursales.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <a href="/login" className="px-6">
                Iniciar Sesión
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/register" className="px-6">
                Registrarse
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar datos de sesión con diseño mejorado
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Icons.logo className="h-8 w-8" />
                <span>Panel de Control</span>
              </CardTitle>
              <Badge variant="outline" className="px-3 py-1">
                {session.user.role || 'Usuario'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={session.user.image || undefined} />
                  <AvatarFallback>
                    {session.user.name
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{session.user.name}</h2>
                <p className="text-gray-600">{session.user.email}</p>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-500 mb-2">Información de Sesión</h3>
                    <p className="text-sm">
                      <span className="font-medium">Proveedor:</span>{' '}
                      {session.user.provider || 'credentials'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Expira:</span>{' '}
                      {new Date(session.expires).toLocaleString()}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-500 mb-2">Accesos Rápidos</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href="/main/sucursales">Sucursales</a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/main/ingredientes">Ingredientes</a>
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t pt-6">
            <Button
              variant="destructive"
              onClick={() => {
                toast.success('Sesión cerrada correctamente');
                signOut();
              }}
            >
              Cerrar Sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}