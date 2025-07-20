import z from "zod";
import { branchFormSchema } from "@/lib/validations/branch";

export interface Employee {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  branch: {
    name: string;
  };
  branchId: string;
  position: string;
  salary: number;
  hiredDate: Date;
  isActive: boolean;
}

export interface CreateEmployeeInput {
  userId?: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  position: string;
  salary: number;
  branchId: string;
  hiredDate: Date;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  product: {
    name: string;
    unit: string;
  };
  branch: {
    name: string;
  };
  quantity: number;
  minStock: number;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  imageUrl?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  schedule: Record<string, string>
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NewEmployeeInput = {
  user: {
    name: string
    email: string
    phone?: string
  }
  position: string
  salary: number
  branchId: string
  hiredDate: Date
  isActive: boolean
}


export type BranchFormData = z.infer<typeof branchFormSchema>;
