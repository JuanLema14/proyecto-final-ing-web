import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/menu/sidebar";
import { cn } from "@/lib/utils";
import { ClientWrapper } from "@/components/client-wrapper";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientWrapper />
      <div className="flex h-full">
        {/* Sidebar - now properly typed with user role */}
        <Sidebar user={{
          ...session.user,
          role: session.user.role || 'user' // Fallback role
        }} />

        {/* Main content area */}
        <main
          className={cn(
            "flex-1 p-6 overflow-auto",
            "transition-all duration-300 ease-in-out",
            "ml-0 lg:ml-64", // Sidebar width adjustment
            "pt-20 lg:pt-6" // Extra top padding on mobile
          )}
        >
          <div
            className={cn(
              "bg-white rounded-xl shadow-sm",
              "p-6 min-h-[calc(100vh-48px)]",
              "border border-gray-100"
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}