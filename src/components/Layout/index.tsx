// tiendaudea/src/components/Layout/index.tsx
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AppSidebar } from '@/components/Dashboard/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

// Lista de rutas que NO necesitan el layout de la app (sidebar, etc.)
const publicPages = ['/admin/login', '/register'];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { status } = useSession();
  const router = useRouter();
  const isPublicPage = publicPages.includes(router.pathname);

  useEffect(() => {
    // Si la sesión está cargando, no hacemos nada todavía.
    if (status === 'loading') return;

    // Si el usuario no está autenticado y está intentando acceder a una página privada,
    // lo redirigimos al login.
    if (status === 'unauthenticated' && !isPublicPage) {
      router.push('/admin/login');
    }
  }, [status, router, isPublicPage]);


  // Si la sesión está cargando, mostramos un loader general para toda la pantalla.
  if (status === 'loading') {
    return (
        <div className="flex h-screen items-center justify-center">
          <div>Loading...</div>
        </div>
    );
  }

  // Si es una página pública (como el login) O el usuario aún no está autenticado,
  // simplemente mostramos el contenido de la página sin el layout principal.
  if (isPublicPage || status === 'unauthenticated') {
    return <>{children}</>;
  }

  // Si el usuario está autenticado y en una página privada, mostramos el layout completo.
  return (
      <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)',
              '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties
          }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
  );
};

export default Layout;