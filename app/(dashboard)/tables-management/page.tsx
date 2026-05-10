"use client";

import { TableCard } from "@/components/TableCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { categories, categoryLabels, TableCategory } from "@/types/types";
import { useAppSelector } from "@/store/hooks";

export default function Tables() {
  const [filter, setFilter] = useState<TableCategory | "all">("all");

  // ✅ Get tables from Redux store
  const tables = useAppSelector((state) => state.tables.tables);

  // ✅ Apply filter
  const filtered =
    filter === "all" ? tables : tables.filter((t) => t.category === filter);

  const groupedTables = tables.reduce(
    (acc, table) => {
      if (!acc[table.category]) {
        acc[table.category] = [];
      }
      acc[table.category].push(table);
      return acc;
    },
    {} as Record<string, typeof tables>,
  );

  return (
    <div className="space-y-6">
      {/* 🔘 Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={filter === cat.value ? "default" : "outline"}
            size="sm"
            className={`text-[14px] transition-all ${
              filter === cat.value
                ? "bg-[#e25f28] text-white hover:bg-[#e25f28]"
                : "bg-transparent border border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setFilter(cat.value)}
          >
            {cat.label}
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
      {filter === "all" ? (
        // ✅ GROUPED VIEW (ONLY ALL)
        <div className="space-y-8">
          {Object.entries(groupedTables).map(([category, tables]) => (
            <div key={category} className="space-y-3">
              {/* Category Title */}
              <h2 className="text-sm font-semibold text-muted-foreground capitalize">
                {categoryLabels[category]}
              </h2>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tables.map((table) => (
                  <TableCard key={table.id} table={table} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ❗ EXISTING VIEW (UNCHANGED)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
        </div>
      )}
    </div>
  );
}
