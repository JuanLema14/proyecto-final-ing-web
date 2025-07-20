import { getBranches } from "@/lib/api/branches";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Phone, Clock, Box, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Función helper para formatear el horario
function formatSchedule(schedule: any) {
  if (!schedule) return "Horario no disponible";

  // Si es un string (JSON), parsearlo
  if (typeof schedule === "string") {
    try {
      schedule = JSON.parse(schedule);
    } catch {
      return "Horario no disponible";
    }
  }

  // Si es un objeto con open/close
  if (schedule.open && schedule.close) {
    return `${schedule.open} - ${schedule.close}`;
  }

  // Si es un objeto con días
  if (typeof schedule === "object" && !Array.isArray(schedule)) {
    return (
      <div className="space-y-1">
        {Object.entries(schedule).map(([day, hours]) => (
          <div key={day} className="text-sm">
            <span className="font-medium capitalize">{day}:</span>{" "}
            {String(hours)}
          </div>
        ))}
      </div>
    );
  }

  return "Horario no disponible";
}

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Sucursales</h1>
          <p className="text-muted-foreground">
            Administra las sucursales de tu restaurante
          </p>
        </div>
        <Button asChild>
          <Link href="branches/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Sucursal
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <Link
            key={branch.id}
            href={`branches//${branch.id}/edit`}
            className="group transition-all duration-200"
          >
            <div className="h-full p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 group-hover:translate-y-[-2px]">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                    <MapPin className="h-5 w-5 text-primary" />
                    {branch.name}
                  </h2>
                  <Badge
                    variant={branch.isActive ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {branch.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-gray-600">{branch.address}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-gray-600">{branch.phone}</p>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-gray-600">
                    <p className="font-medium text-gray-700">Horario:</p>
                    {formatSchedule(branch.schedule)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  <p className="text-gray-600">
                    <span className="font-medium">
                      {branch.inventory?.length || 0}
                    </span>{" "}
                    productos en inventario
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
