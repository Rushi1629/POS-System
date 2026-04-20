"use client";

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

export type UserRole = "Admin" | "Manager" | "Staff";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  password?: string;
  createdAt: string;
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
  Admin: 1,
  Manager: 2,
  Staff: 3,
};

export const roleReverseMap: Record<number, UserRole> = {
  1: "Admin",
  2: "Manager",
  3: "Staff",
};
