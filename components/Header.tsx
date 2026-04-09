"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

export default function Header() {
  return (
    <div className="h-14 border-b flex items-center px-4 justify-between fixed-top">
      
      {/* Mobile Menu */}
      <Sheet>
        {/* <SheetTrigger className="md:hidden">
          <Menu />
        </SheetTrigger> */}

        <SheetContent side="left" className="p-0 w-64 bg-gray-900 text-white">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <h1 className="font-semibold text-lg">Dashboard</h1>
    </div>
  );
}