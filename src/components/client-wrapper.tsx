"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ClientWrapper() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    console.log("ClientWrapper mounted", error);

    if (error === "unauthorized") {
      toast.error("Acceso denegado: No tienes permisos para acceder.");
    }
  }, [searchParams]);

  return null;
}
