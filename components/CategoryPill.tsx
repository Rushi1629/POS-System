import React from "react";
import { Category } from "@/lib/data";

function CategoryPill({
  category,
  isActive,
  onClick,
}: {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 px-3 py-2 min-w-[80px] rounded-xl transition-all duration-200 shrink-0 ${
        isActive
          ? "border-primary bg-primary/10 shadow-primary/10 ring-2 ring-[#e25f28] shadow-sm"
          : "border-border bg-card hover:border-primary/40 hover:-translate-y-0.5"
      }`}
    >
      {/* ✅ FIX HERE */}
      <img
        src={category.imageUrl}
        alt={category.name}
        className="w-10 h-10 object-cover rounded-full"
      />

      <span
        className={`text-xs font-medium text-center leading-tight ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {category.name}
      </span>
    </button>
  );
}

export default React.memo(CategoryPill);
