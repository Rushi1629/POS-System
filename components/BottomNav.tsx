"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, ClipboardList, ChefHat, Users } from "lucide-react";
import { useFetchTableByTokenCustomer } from "@/client/hooks/useCustomer";

export default function BottomNav() {
  const pathname = usePathname();

  if (!pathname.startsWith("/customer")) return null;
  const searchParams = useSearchParams();

  const tableToken = searchParams?.get("tableToken");

  console.log(tableToken, "token");

  const {
    data: tableData,
    isLoading: isLoadingTable,
    refetch: refetchTable,
  } = useFetchTableByTokenCustomer(tableToken);

  if (!tableToken) return null;

  const withToken = (path: string) => `${path}?tableToken=${tableToken}`;

  const navItems = [
    {
      name: "Menu",
      href: withToken("/customer"),
      icon: Home,
    },
    {
      name: "My Orders",
      href: withToken("/customer-order"),
      icon: ClipboardList,
    },
    {
      name: "Kitchen",
      href: withToken("/admin/chef"),
      icon: ChefHat,
    },
    {
      name: "Users",
      href: withToken("/admin/customers"),
      icon: Users,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full border-t shadow-md z-50 filter backdrop-blur-md bg-white/70 dark:bg-(--background)">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center text-xs"
            >
              <item.icon
                className={`h-5 w-5 mb-1 ${
                  isActive ? "text-black" : "text-gray-400"
                }`}
              />
              <span
                className={`${
                  isActive ? "text-black font-medium" : "text-gray-400"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
