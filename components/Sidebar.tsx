"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Table2,
  CreditCard,
  Package,
  BarChart3,
  Users,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react";
import Image from "next/image";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  group: string;
}

const navItems: NavItem[] = [
  {
    id: "nav-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    group: "Operations",
  },
  {
    id: "nav-orders",
    label: "Order Management",
    icon: ShoppingCart,
    href: "/order-management",
    badge: 4,
    group: "Operations",
  },
  {
    id: "nav-menu",
    label: "Menu",
    icon: UtensilsCrossed,
    href: "/dashboard",
    group: "Operations",
  },
  {
    id: "nav-tables",
    label: "Tables",
    icon: Table2,
    href: "/dashboard",
    group: "Operations",
  },
  {
    id: "nav-billing",
    label: "Billing",
    icon: CreditCard,
    href: "/dashboard",
    group: "Finance",
  },
  {
    id: "nav-inventory",
    label: "Inventory",
    icon: Package,
    badge: 3,
    href: "/dashboard",
    group: "Finance",
  },
  {
    id: "nav-reports",
    label: "Reports",
    icon: BarChart3,
    href: "/dashboard",
    group: "Management",
  },
  {
    id: "nav-staff",
    label: "Staff & Shifts",
    icon: Users,
    href: "/dashboard",
    group: "Management",
  },
  {
    id: "nav-shifts",
    label: "Shift Log",
    icon: Clock,
    href: "/dashboard",
    group: "Management",
  },
];

const groups = ["Operations", "Finance", "Management"];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
    <aside
      className={`
    relative flex flex-col bg-stone-900 border-r border-stone-800 
    transition-all duration-300 ease-in-out overflow-visible
    ${collapsed ? "w-[64px]" : "w-[240px]"}
    h-full z-20
  `}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-4 border-b border-stone-800 ${collapsed ? "justify-center px-2" : ""}`}
      >
        <Image
          src="/cafe_logo.png"
          alt="The Secret Cafe"
          width={80}
          height={50}
          className="mx-auto"
          priority
        />
        {/* {!collapsed && (
          <span className="font-semibold text-white text-base tracking-tight truncate">
            Cafe POS
          </span>
        )} */}
      </div>

      {/* Shift indicator */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-amber-400 font-medium">
            Morning Shift Active
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            Started 06:00 AM · 2h 01m
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto custom-scrollbar">
        {groups.map((group) => {
          const items = navItems.filter((n) => n.group === group);
          return (
            <div key={`group-${group}`} className="mb-4">
              {!collapsed && (
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider px-2 mb-1">
                  {group}
                </p>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`
                      group relative flex items-center gap-3 px-2 py-2 rounded-lg mb-0.5 transition-all duration-150
                      ${
                        isActive
                          ? "bg-amber-500/15 text-amber-400"
                          : "text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                      }
                      ${collapsed ? "justify-center" : ""}
                    `}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate">
                        {item.label}
                      </span>
                    )}
                    {item.badge && !collapsed && (
                      <span className="ml-auto bg-amber-500 text-stone-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {item.badge && collapsed && (
                      <span className="absolute top-1 right-1 bg-amber-500 text-stone-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-stone-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-150">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-stone-800 p-2">
        <Link
          href="/dashboard"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 px-2 py-2 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-stone-100 transition-all duration-150 mb-1 ${collapsed ? "justify-center" : ""}`}
        >
          <Bell size={18} className="shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium">Notifications</span>
          )}
          {!collapsed && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          )}
        </Link>
        <Link
          href="/dashboard"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 px-2 py-2 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-stone-100 transition-all duration-150 mb-1 ${collapsed ? "justify-center" : ""}`}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>

        {/* User profile */}
        <div
          className={`flex items-center gap-2 px-2 py-2 mt-1 rounded-lg bg-stone-800 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-stone-900 text-xs font-bold shrink-0">
            MA
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-200 truncate">
                Maria Alvarez
              </p>
              <p className="text-xs text-stone-500 truncate">Admin</p>
            </div>
          )}
          {!collapsed && (
            <Link
              href="/sign-up-login"
              className="text-stone-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-15 w-6 h-6 bg-stone-700 border border-stone-600 rounded-full flex items-center justify-center text-stone-300 hover:bg-stone-600 transition-all duration-150 shadow-md z-30"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
    </>
  );
}
