import { Table, TableStatus } from "@/types/types";

export const handleUpdateStatus = (
  tables: Table[],
  id: string,
  status: TableStatus
): Table[] => {
  return tables.map((t): Table => {
    if (t.id !== id) return t;

    if (status === "available") {
      return {
        ...t,
        status,
        guestCount: undefined,
        timerStart: undefined,
      };
    }

    return {
      ...t,
      status,
    };
  });
};

export const handleSeatGuests = (
  tables: Table[],
  id: string,
  count: number
): Table[] => {
  return tables.map((t): Table => {   // 👈 IMPORTANT
    if (t.id !== id) return t;

    return {
      ...t,
      status: "occupied", // ✅ now correctly inferred
      guestCount: count,
      timerStart: new Date().toISOString(),
    };
  });
};

export const handleClearTable = (
  tables: Table[],
  id: string
): Table[] => {
  return tables.map((t): Table => {   // 👈 IMPORTANT
    if (t.id !== id) return t;

    return {
      ...t,
      status: "cleaning", // ✅ now treated as TableStatus
      guestCount: undefined,
      timerStart: undefined,
    };
  });
};