"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import "../globals.css";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const pathname = usePathname();

  // // ✅ Show sidebar only for /admin routes
  // const showSidebar = pathname.startsWith("/admin");
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop only */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* <div className="hidden md:block w-64 bg-gray-900 text-white">
      </div> */}

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 overflow-y-auto pb-20 bg-[#f9f7f5]">{children}</main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
