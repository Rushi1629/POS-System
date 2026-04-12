import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Table } from "@/types/types";
import { handleClearTable, handleSeatGuests, handleUpdateStatus } from "./tableReducer";

type TableState = {
  tables: Table[];
};

const initialState: TableState = {
  tables: [
    { id: "1", number: 1, category: "family", status: "available", seats: 4 },
    { id: "2", number: 2, category: "family", status: "available", seats: 4 },
    { id: "3", number: 3, category: "family", status: "occupied", seats: 4 },
    { id: "4", number: 4, category: "family", status: "available", seats: 4 },
    { id: "5", number: 5, category: "family", status: "occupied", seats: 4 },
    { id: "6", number: 6, category: "pod", status: "available", seats: 2 },
    { id: "7", number: 7, category: "pod", status: "reserved", seats: 6 },
    { id: "8", number: 8, category: "pod", status: "reserved", seats: 6 },
    { id: "9", number: 9, category: "hall", status: "reserved", seats: 6 },
    { id: "10", number: 10, category: "hall", status: "cleaning", seats: 6 },
    { id: "11", number: 11, category: "hall", status: "reserved", seats: 6 },
    { id: "12", number: 12, category: "hall", status: "cleaning", seats: 6 },
  ],
};

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    updateTableStatus: (
      state,
      action: PayloadAction<{ id: string; status: Table["status"] }>
    ) => {
      state.tables = handleUpdateStatus(
        state.tables,
        action.payload.id,
        action.payload.status
      );
    },

    seatGuests: (
      state,
      action: PayloadAction<{ id: string; count: number }>
    ) => {
      state.tables = handleSeatGuests(
        state.tables,
        action.payload.id,
        action.payload.count
      );
    },

    clearTable: (state, action: PayloadAction<string>) => {
      state.tables = handleClearTable(state.tables, action.payload);
    },
  },
});

export const {
  updateTableStatus,
  seatGuests,
  clearTable,
} = tableSlice.actions;

export default tableSlice.reducer;