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

export type Inventory = {
  id: string;
  productId: string;
  branchId: string;
  quantity: number;
  minStock: number;
  updatedAt: Date;
  product: {
    id: string;
    name: string;
    unit: string;
  };
};

export type Movement = {
  id: string;
  type: "entrada" | "salida";
  productId: string;
  quantity: number;
  date: Date;
  employeeId?: string;
  userId?: string;
  notes?: string;
  reference?: string;
  product: {
    id: string;
    name: string;
    unit: string;
  };
};

export type Product = {
  id: string;
  name: string;
  description: string;
  barcode: string;
  unit: string;
  cost: number;
  category: string;
  recipes: string[];
  movements: Movement[];
  inventory: Inventory[];
  createdAt: Date;
  updatedAt: Date;
};

export type BranchFormData = z.infer<typeof branchFormSchema>;
