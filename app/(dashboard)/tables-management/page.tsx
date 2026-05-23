"use client";

import { TableCard } from "@/components/TableCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEditTableSession, useFetchTables } from "@/api/hooks/useTable";
import {
  TABLE_TYPE_LABELS,
  TABLE_TYPES,
  TableType,
  EditTableSessionPayload,
} from "@/types/table-types";
import { useQueryClient } from "@tanstack/react-query";

export default function TablesManagement() {
  const [filter, setFilter] = useState<TableType | "ALL">("ALL");

  const { data: tables = [], isLoading } = useFetchTables();

  const [guestMap, setGuestMap] = useState<Record<number, number>>({});

  const [loadingTableId, setLoadingTableId] = useState<number | null>(null);

  const { mutateAsync: updateTableSession, isPending: isPending } =
    useEditTableSession();

  const queryClient = useQueryClient();

  const handleUpdateSession = async (payload: EditTableSessionPayload) => {
    try {
      setLoadingTableId(payload.tableId);

      await updateTableSession(payload);

      queryClient.invalidateQueries({
        queryKey: ["liveCharge", payload.tableId],
      });

      setGuestMap((prev) => ({
        ...prev,
        [payload.tableId]: payload.guestCount,
      }));
    } finally {
      setLoadingTableId(null);
    }
  };

  const mappedTables = tables.map((t) => ({
    id: t.id,
    name: t.name,
    type: t.type,
    tableStatus: t.tableStatus,
    capacity: t.capacity,
    enableTimeRate: t.enableTimeRate,
    ratePerMinute: t.ratePerMinute,
    chargePerPerson: (t as any).chargePerPerson,
    guestCount: (t as any).guestCount ?? 0,
    qrCode: t.qrCode,
    isActive: t.isActive,
  }));

  const filtered =
    filter === "ALL"
      ? mappedTables
      : mappedTables.filter((t) => t.type === filter);

  const groupedTables = mappedTables.reduce(
    (acc, table) => {
      if (!acc[table.type]) {
        acc[table.type] = [];
      }
      acc[table.type].push(table);
      return acc;
    },
    {} as Record<TableType, typeof mappedTables>,
  );
  return (
    <div className="space-y-6">
      {/* 🔘 Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* ✅ ALL BUTTON */}
        <Button
          variant={filter === "ALL" ? "default" : "outline"}
          size="sm"
          className={`text-[14px] transition-all ${
            filter === "ALL"
              ? "bg-[#e25f28] text-white hover:bg-[#e25f28]"
              : "bg-transparent border border-gray-300 hover:bg-gray-100"
          }`}
          onClick={() => setFilter("ALL")}
        >
          All
        </Button>

        {/* ✅ TABLE TYPE BUTTONS */}
        {TABLE_TYPES.map((type) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "outline"}
            size="sm"
            className={`text-[14px] transition-all ${
              filter === type
                ? "bg-[#e25f28] text-white hover:bg-[#e25f28]"
                : "bg-transparent border border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setFilter(type)}
          >
            {TABLE_TYPE_LABELS[type]}
          </Button>
        ))}
      </div>

      {/* 🟢 Status Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#2eb860]" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#dc2828]" />
          Occupied
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#3374db]" />
          Reserved
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#f59f0a]" />
          Cleaning
        </span>
      </div>

      {/* 🪑 TABLE VIEW */}
      {filter === "ALL" ? (
        // ✅ GROUPED VIEW (ONLY ALL)
        <div className="space-y-8">
          {TABLE_TYPES.map((type) => {
            const tables = groupedTables[type];

            if (!tables || tables.length === 0) return null;

            return (
              <div key={type} className="space-y-3">
                {/* Category Title */}
                <h2 className="text-sm font-semibold text-muted-foreground capitalize">
                  {TABLE_TYPE_LABELS[type]} ({tables.length})
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tables.map((table) => (
                    <TableCard
                      key={table.id}
                      table={table}
                      guestCount={guestMap[table.id] ?? 0}
                      onUpdateSession={handleUpdateSession}
                      isPending={loadingTableId === table.id}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          No tables found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              guestCount={guestMap[table.id] ?? 0}
              onUpdateSession={handleUpdateSession}
              isPending={loadingTableId === table.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
