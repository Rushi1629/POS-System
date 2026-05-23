"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const route = pathname.split("/").filter(Boolean)[0] || "";

  const formattedRoute = route.charAt(0).toUpperCase() + route.slice(1);

  console.log(formattedRoute); // Customer

  return (
    <div className="h-14 border-b flex items-center px-4 justify-between fixed-top">
      <Sheet>
        <SheetContent side="left" className="p-0 w-64 bg-gray-900 text-white">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <h1 className="font-semibold text-lg">
        {/* {showHeader ? "Customer" : "Welcome to Secret Cafe!"} */}
        {formattedRoute}
      </h1>
    </div>
  );
}
