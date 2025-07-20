import "./globals.css";
import AuthProvider from "@/app/providers/auth-provider";
import { ReactQueryProvider } from "@/app/providers/react-query-provider";
import { Toaster } from "sonner";

export const metadata = {
  title: "Mi App",
  description: "Ejemplo NextAuth con credenciales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ReactQueryProvider>
            <Toaster richColors position="top-right" />
            {children}
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
