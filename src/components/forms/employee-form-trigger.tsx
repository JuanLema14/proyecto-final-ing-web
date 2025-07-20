"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeForm } from "@/components/forms/employee-form";
import { Branch, Employee } from "@/lib/types";

export function EmployeeFormTrigger({
  branches,
  currentUserBranchId,
  employee,
}: {
  branches: Branch[];
  currentUserBranchId?: string;
  employee?: Employee;
}) {
  const [open, setOpen] = useState(!!employee);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Empleado
      </Button>
      <EmployeeForm
        open={open}
        onOpenChange={setOpen}
        branches={branches}
        currentUserBranchId={currentUserBranchId}
        employee={employee}
      />
    </>
  );
}
export default EmployeeFormTrigger;