"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, ClipboardList } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFetchTableByTokenCustomer } from "@/client/hooks/useCustomer";
import { useProfile } from "@/client/hooks/useAuth";
import { navItems } from "@/types/types";

const normalizeRole = (role?: string) => {
  if (!role) return undefined;
  return role.toLowerCase().replace(/\s+/g, "");
};

function CustomerBottomNav({
  pathname,
  tableToken,
}: {
  pathname: string;
  tableToken: string;
}) {
  useFetchTableByTokenCustomer(tableToken);

  const withToken = (path: string) => `${path}?tableToken=${tableToken}`;
  const navItemsCustomer = [
    { name: "Menu", href: withToken("/customer"), icon: Home },
    {
      name: "My Orders",
      href: withToken("/customer-order"),
      icon: ClipboardList,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full border-t shadow-md z-50 filter backdrop-blur-md bg-white/70 dark:bg-(--background)">
      <div className="flex justify-around items-center h-16">
        {navItemsCustomer.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center text-xs"
            >
              <Icon
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

function StaffBottomNav({ pathname }: { pathname: string }) {
  const navContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const { data: user } = useProfile();
  const role = normalizeRole(user?.role?.name);
  const visibleItems = navItems.filter((item) =>
    item.roles.some((allowedRole) => normalizeRole(allowedRole) === role),
  );

  useEffect(() => {
    const container = navContainerRef.current;
    const activeItem = activeItemRef.current;
    if (!container || !activeItem) return;

    const itemCenter =
      activeItem.getBoundingClientRect().left -
      container.getBoundingClientRect().left +
      activeItem.clientWidth / 2;

    container.scrollTo({
      left: container.scrollLeft + itemCenter - container.clientWidth / 2,
      behavior: "smooth",
    });
  }, [pathname, role]);

  if (!visibleItems.length) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/70 bg-background/95 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/80">
      <div
        ref={navContainerRef}
        className="flex h-16 min-w-0 items-center gap-1 overflow-x-auto px-2 no-scrollbar"
      >
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.id}
              ref={isActive ? activeItemRef : undefined}
              href={item.href}
              className={[
                "flex min-w-18 shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] transition-colors",
                isActive
                  ? "bg-amber-500/15 text-amber-500"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tableToken = searchParams?.get("tableToken");

  if (pathname.startsWith("/customer")) {
    return tableToken ? (
      <CustomerBottomNav pathname={pathname} tableToken={tableToken} />
    ) : null;
  }

  return <StaffBottomNav pathname={pathname} />;
}
