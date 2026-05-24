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
import { useFetchTableByToken } from "@/api/hooks/useCustomer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/customer";
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  const tableToken = searchParams?.get("tableToken");
  
  const {
    data: tableData,
    isLoading: isLoadingTable,
    isError: isTableError,
  } = useFetchTableByToken(tableToken);

  const table = tableData;

  console.log(tableData,"data");
  

  useEffect(() => {
    const load = async () => {
      const items = await loadCartFromDB();
      dispatch(setCartAction(items));
    };

    load();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop only */}
      {showSidebar && (
        <div className="hidden md:block">
          <Sidebar />
        </div>
      )}
      {/* <div className="hidden md:block w-64 bg-gray-900 text-white">
      </div> */}

      <div className="flex-1 flex flex-col min-w-0">
        <Header table={table} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto pb-20 bg-[#f9f7f5]">
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
