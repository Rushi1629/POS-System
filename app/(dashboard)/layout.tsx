"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import "../globals.css";
import { Suspense, useEffect } from "react";
import SecretCafeLoader from "@/components/SecretCafeLoader";
import { useAppDispatch } from "@/store/hooks";
import { loadCartFromDB } from "@/lib/db";
import { setCartAction } from "../../store/cart/cartSlice";
import { store } from "../../store/store";
import { usePathname, useSearchParams } from "next/navigation";
import { useFetchTableByTokenCustomer } from "@/client/hooks/useCustomer";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = !pathname.startsWith("/customer");
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  const tableToken = searchParams?.get("tableToken");

  const {
    data: tableData,
    isLoading: isLoadingTable,
    isError: isTableError,
  } = useFetchTableByTokenCustomer(tableToken);

  const table = tableData;

  useEffect(() => {
    const load = async () => {
      const items = await loadCartFromDB(tableToken ?? undefined);
      dispatch(setCartAction(items));
    };

    load();
  }, [tableToken]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop only */}
      {showSidebar && (
        <div className="hidden md:block">
          <Sidebar />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header table={table} />

        <main
          className={cn(
            "flex-1 overflow-y-auto pb-20 bg-(--background) scrollbar-orange",
            pathname.startsWith("/customer") ? "pt-0 pr-6 pl-6 pb-24 lg:pr-8 lg:pl-8 lg:pb-8" : "p-6 lg:p-8",
          )}
        >
          <Suspense
            fallback={<SecretCafeLoader message="Loading dashboard..." />}
          >
            {children}
          </Suspense>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
