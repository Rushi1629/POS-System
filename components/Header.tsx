"use client";

import { Menu, Table } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

type Props = {
  table?: { name?: string } | null;
};

export default function Header({ table }: Props) {
  const pathname = usePathname();
  const route = pathname.split("/").filter(Boolean)[0] || "";

  const formattedRoute = route.charAt(0).toUpperCase() + route.slice(1);

  return (
    <div className="h-14 border-b flex items-center px-4 justify-between fixed-top">
      <Sheet>
        <SheetContent side="left" className="p-0 w-64 bg-gray-900 text-white">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex items-baseline justify-between w-full gap-3">
        <h1 className="font-semibold text-lg">{formattedRoute}</h1>
        {table?.name && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md border bg-gradient-to-r from-primary/10 to-secondary/10">
            <Table className="w-4 h-4 text-primary" />
            {table.name}
          </span>
        )}
      </div>
    </div>
  );
}
