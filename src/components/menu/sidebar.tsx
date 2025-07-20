"use client";

import { User } from "next-auth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  LogOut,
} from "lucide-react";

interface SidebarUser extends User {
  id: string;
  role: string;
  email?: string;
  name?: string;
  image?: string;
}

interface SidebarProps {
  user: SidebarUser;
}

type UserRole = "SUPER_ADMIN" | "GERENTE_SUCURSAL" | "MESERO" | "USER";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const userRole = (user.role as UserRole) || "USER";

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/main",
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ["SUPER_ADMIN", "GERENTE_SUCURSAL", "MESERO"],
    },
    {
      name: "Sucursales",
      href: "/main/branches",
      icon: <FileText className="w-5 h-5" />,
      roles: ["SUPER_ADMIN", "GERENTE_SUCURSAL"],
    },
    /* { 
      name: 'Menú', 
      href: '/main/menu', 
      icon: <Utensils className="w-5 h-5" />, 
      roles: ['SUPER_ADMIN', 'GERENTE_SUCURSAL'] 
    }, */
    /* { 
      name: 'Órdenes', 
      href: '/main/orders', 
      icon: <ShoppingCart className="w-5 h-5" />, 
      roles: ['SUPER_ADMIN', 'GERENTE_SUCURSAL', 'MESERO'] 
    }, */
    {
      name: "Inventario",
      href: "/main/inventory",
      icon: <Package className="w-5 h-5" />,
      roles: ["SUPER_ADMIN", "GERENTE_SUCURSAL"],
    },
    {
      name: "Empleados",
      href: "/main/employees",
      icon: <Users className="w-5 h-5" />,
      roles: ["SUPER_ADMIN"],
    },
    /*  { 
      name: 'Turnos', 
      href: '/main/schedules', 
      icon: <Clock className="w-5 h-5" />, 
      roles: ['SUPER_ADMIN', 'GERENTE_SUCURSAL'] 
    },
    { 
      name: 'Reportes', 
      href: '/main/reports', 
      icon: <FileText className="w-5 h-5" />, 
      roles: ['SUPER_ADMIN', 'GERENTE_SUCURSAL'] 
    },
    { 
      name: 'Configuración', 
      href: '/main/settings', 
      icon: <Settings className="w-5 h-5" />, 
      roles: ['SUPER_ADMIN'] 
    }, */
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64",
        "bg-white shadow-xl",
        "flex flex-col",
        "border-r border-gray-200",
        "transform -translate-x-full lg:translate-x-0"
      )}
    >
      {/* Encabezado con gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
        <h1 className="text-xl font-bold text-white">Restaurante Admin</h1>

        <div className="flex items-center mt-4 space-x-3">
          {user.image ? (
            <img
              src={user.image}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0) || user.email?.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name || user.email}
            </p>
            <span
              className={cn(
                "inline-block mt-1 text-xs px-2 py-1 rounded-full",
                userRole === "SUPER_ADMIN"
                  ? "bg-purple-100 text-purple-800"
                  : userRole === "GERENTE_SUCURSAL"
                  ? "bg-blue-100 text-blue-800"
                  : userRole === "MESERO"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              {userRole.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Items de navegación */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.map((item, index) => (
            <motion.li
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg",
                  "text-sm font-medium transition-all duration-200",
                  "hover:bg-blue-50 hover:text-blue-600",
                  pathname.startsWith(item.href)
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                    : "text-gray-700"
                )}
              >
                <span
                  className={cn(
                    "mr-3 p-1 rounded-md",
                    pathname.startsWith(item.href)
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  {item.icon}
                </span>
                {item.name}
                {pathname.startsWith(item.href) && (
                  <motion.span
                    layoutId="activeItem"
                    className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="p-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center w-full px-4 py-3 rounded-lg",
            "text-sm font-medium transition-colors",
            "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar sesión
        </motion.button>
      </div>
    </motion.div>
  );
}
