"use client";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  AtSign,
  Lock,
  ShieldCheck,
} from "lucide-react";

import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Table2,
  CreditCard,
  Package,
  BarChart3,
  Users,
  Clock,
} from "lucide-react";

export type CartState = {
  cart: Record<string, number>;
};

export type TableStatus = "available" | "occupied" | "reserved" | "cleaning";
export type TableCategory = "family" | "pod" | "hall";

export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export interface DemoCredential {
  role: string;
  roleLabel: string;
  email: string;
  password: string;
  accent: string;
  dot: string;
}

export type Table = {
  id: string;
  number: number;
  category: TableCategory;
  status: TableStatus;
  seats: number;
  guestCount?: number;
  timerStart?: string;
};

// 🧠 Labels
export const categoryLabels: Record<string, string> = {
  family: "Family",
  pod: "POD Room",
  hall: "Hall",
};

export const statusLabels: Record<string, string> = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  cleaning: "Cleaning",
};

// 🎯 Categories
export const categories: { label: string; value: TableCategory | "all" }[] = [
  { label: "All Tables", value: "all" },
  { label: "Family", value: "family" },
  { label: "POD Rooms", value: "pod" },
  { label: "Halls", value: "hall" },
];

export const statusStyles: Record<string, string> = {
  available: "bg-[#2eb8601a] text-[#2eb860] border-[#2eb86033]",
  occupied: "bg-[#dc28281a] text-[#dc2828] border-[#dc282833]",
  reserved: "bg-[#3374db1a] text-[#3374db] border-[#3374db33]",
  cleaning: "bg-[#f59f0a1a] text-[#f59f0a] border-[#f59f0a33]",
};

export const statusBg: Record<string, string> = {
  available: "bg-gradient-to-br from-[#2eb860]/10 to-transparent",
  occupied: "bg-gradient-to-br from-[#dc2828]/10 to-transparent",
  reserved: "bg-gradient-to-br from-[#3374db]/10 to-transparent",
  cleaning: "bg-gradient-to-br from-[#f59f0a]/10 to-transparent",
};

export type UserRole = "Super Admin" | "Admin" | "Chef" | "Waiter" | "Customer";

export interface Role {
  id: number;
  name: UserRole;
  description?: string | null;
  isActive: boolean;
}

export interface userProps {
  users: User[];
  roles: Role[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onCreate?: () => void;
}

export const roleStyles: Record<UserRole, string> = {
  "Super Admin":
    "bg-red-500/10 text-red-700 border border-red-500/30",

  Admin:
    "bg-blue-500/10 text-blue-700 border border-blue-500/30",

  Chef:
    "bg-orange-500/10 text-orange-700 border border-orange-500/30",

  Waiter:
    "bg-purple-500/10 text-purple-700 border border-purple-500/30",

  Customer:
    "bg-teal-500/10 text-teal-700 border border-teal-500/30",
};

export type UsersResponse = {
  status: boolean;
  message: string;
  data: User[];
};

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  isActive: boolean;
  role: UserRole;
}

export const empty: UserFormValues = {
  name: "",
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
  role: "Waiter",
};

export interface AddUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  mode: "create" | "edit";
  initialUser?: User | null;
  loading?: boolean;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}

export interface UserFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  email: string;
  password?: string;
  phoneNumber: string;
  roleId: number;
}

export const roleMap: Record<UserRole, number> = {
  "Super Admin": 1,
  Admin: 2,
  Chef: 3,
  Waiter: 4,
  Customer: 5,
};

export const roleReverseMap: Record<number, UserRole> = {
  1: "Super Admin",
  2: "Admin",
  3: "Chef",
  4: "Waiter",
  5: "Customer",
};

export type FieldDef = {
  key: keyof Omit<UserFormValues, "role">;
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  full?: boolean;
};

export const fields: FieldDef[] = [
  {
    key: "name",
    label: "Full Name",
    placeholder: "Jane Doe",
    icon: UserIcon,
    full: true,
  },
  {
    key: "username",
    label: "Username",
    placeholder: "janedoe",
    icon: AtSign,
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "jane@cafe.io",
    icon: Mail,
  },
  {
    key: "phoneNumber",
    label: "Phone",
    placeholder: "+1 555 123 4567",
    icon: Phone,
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    icon: Lock,
  },
];

// Sidebar navigation items start here

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  group: string;
}

export const navItems: NavItem[] = [
  {
    id: "nav-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    group: "Operations",
  },
  {
    id: "nav-orders",
    label: "Order Management",
    icon: ShoppingCart,
    href: "/order-management",
    badge: 4,
    group: "Operations",
  },
  {
    id: "nav-menu",
    label: "Menu",
    icon: UtensilsCrossed,
    href: "/dashboard",
    group: "Operations",
  },
  {
    id: "nav-tables",
    label: "Tables",
    icon: Table2,
    href: "/dashboard",
    group: "Operations",
  },
  {
    id: "nav-billing",
    label: "Billing",
    icon: CreditCard,
    href: "/dashboard",
    group: "Finance",
  },
  {
    id: "nav-inventory",
    label: "Inventory",
    icon: Package,
    badge: 3,
    href: "/dashboard",
    group: "Finance",
  },
  {
    id: "nav-reports",
    label: "Reports",
    icon: BarChart3,
    href: "/dashboard",
    group: "Management",
  },
  {
    id: "nav-staff",
    label: "Staff & Shifts",
    icon: Users,
    href: "/dashboard",
    group: "Management",
  },
  {
    id: "nav-shifts",
    label: "Shift Log",
    icon: Clock,
    href: "/dashboard",
    group: "Management",
  },
];

// Sidebar navigation items end here
