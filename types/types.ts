"use client";

export type CartState = {
  cart: Record<string, number>;
};

export type TableStatus = "available" | "occupied" | "reserved" | "cleaning";
export type TableCategory = "family" | "pod" | "hall";

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
