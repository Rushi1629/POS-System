"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardList,
  ChefHat,
  Users,
} from "lucide-react";

const navItems = [
  {
    name: "Home",
    href: "/admin",
    icon: Home,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    name: "Kitchen",
    href: "/admin/chef",
    icon: ChefHat,
  },
  {
    name: "Users",
    href: "/admin/customers",
    icon: Users,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">
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