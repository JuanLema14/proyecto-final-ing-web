import {
  IconDashboard,
  IconShoppingBag,
  IconBuildingStore,
  IconUsers,
  IconClipboardList,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import { NavMain } from "@/components/Dashboard/nav-main";
import { NavUser } from "@/components/Dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import Link from 'next/link';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navData = {
    user: {
      name: "Juan Lema",
      email: "juan.lema1408@gmail.com",
      role: "Administrador",
    },
    mainNav: [
      {
        title: "Dashboard",
        url: "/main",
        icon: IconDashboard,
      },
      {
        title: "Sucursales",
        url: "/main/sucursales",
        icon: IconBuildingStore,
        subItems: [
          { title: "Listado", url: "/main/sucursales" },
          { title: "Nueva Sucursal", url: "/main/sucursales/nueva" },
        ],
      },
      {
        title: "Menú",
        url: "/main/menu",
        icon: IconToolsKitchen2,
        subItems: [
          { title: "Categorías", url: "/main/menu" },
          { title: "Ingredientes", url: "/main/menu/ingredientes" },
        ],
      },
      {
        title: "Pedidos",
        url: "/main/pedidos",
        icon: IconClipboardList,
        subItems: [
          { title: "Pedidos en curso", url: "/main/pedidos/en-curso" },
          { title: "Historial", url: "/main/pedidos/historial" },
        ],
      },
      {
        title: "Empleados",
        url: "/main/usuarios",
        icon: IconUsers,
        subItems: [
          { title: "Lista de usuarios", url: "/main/usuarios" },
          { title: "Roles y permisos", url: "/main/usuarios/roles" },
        ],
      },
    ],
    secondaryNav: [],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-4 py-3 border-b">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <IconShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">TiendaUdea</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <NavMain
          items={navData.mainNav}
          className="mt-4"
          itemClassName="hover:bg-gray-100 rounded-md px-3 py-2"
          activeItemClassName="bg-primary-50 text-primary font-medium"
        />

        <div className="mt-auto border-t pt-4">
          <NavMain
            items={navData.secondaryNav}
            className="space-y-1"
            itemClassName="hover:bg-gray-100 rounded-md px-3 py-2"
          />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <NavUser
          user={navData.user}
          className="hover:bg-gray-100 rounded-md p-2"
          showRole={true}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
