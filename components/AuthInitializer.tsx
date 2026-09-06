"use client";

import { useProfile } from "@/client/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser, clearUser } from "@/store/auth/authSlice";
import ApiLoader from "./ApiLoader";
import { navItems } from "@/types/types";

type Props = {
  children: React.ReactNode;
};

export default function AuthInitializer({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [authorizedPath, setAuthorizedPath] = useState<string | null>(null);

  // Disable profile fetch for public customer routes (QR-based sessions)
  // Profile is only needed for authenticated staff routes
  const isPublicCustomerRoute = pathname.startsWith("/customer");

  const {
    data: user,
    isLoading,
    isError,
  } = useProfile({
    enabled:
      !isPublicCustomerRoute &&
      pathname !== "/register",
  });

  const getDefaultRouteByRole = (roleName?: string) => {
    if (roleName === "Super Admin") return "/dashboard";
    if (roleName === "Chef" || roleName === "Waiter") {
      return "/order-item-status-management";
    }
    return "/dashboard";
  };

  useEffect(() => {
    // Public customer/register routes never redirect based on staff profile.
    const publicPaths = ["/customer", "/register"];
    if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      setAuthorizedPath(pathname);
      return;
    }

    // Home and login are auth entry points: keep them public when signed out,
    // but send an existing session to its role-appropriate landing page.
    if (pathname === "/" || pathname === "/login") {
      if (isLoading) return;

      if (user) {
        dispatch(setUser(user));
        router.replace(getDefaultRouteByRole(user.role?.name));
        return;
      }

      setAuthorizedPath(pathname);
      return;
    }

    setAuthorizedPath(null);

    // Trigger the profile fetch when on protected routes.
    // refetch();

    // 🚫 Wait until loading finishes
    if (isLoading) return;

    // 🧠 Wait until we know user OR confirmed error
    if (!user && !isError) return;

    if (isError && !user) {
      dispatch(clearUser());
      router.replace("/login");
      return;
    }

    console.log("AuthInitializer user:", user);

    // ❌ No user → redirect (only when not on login/register)
    // if (!user) {
    //   if (pathname !== "/login" && pathname !== "/register") {
    //     router.replace("/login");
    //   }
    //   return;
    // }

    // ✅ Set user in store
    if (user) {
      dispatch(setUser(user));
    }

    // ✅ Role-based route protection
    const findNavItem = navItems.find((item) => pathname.startsWith(item.href));

    if (
      findNavItem &&
      user?.role?.name &&
      !findNavItem.roles.includes(user.role.name)
    ) {
      router.replace("/unauthorized");
      return;
    }

    setAuthorizedPath(pathname);

  }, [pathname, user, isLoading, isError, router]);

  const publicPaths = ["/customer", "/login", "/register"];
  const isPublicRoute =
    pathname === "/" ||
    publicPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/"),
    );

  if (isLoading || (!isPublicRoute && authorizedPath !== pathname)) {
    return <ApiLoader message="Loading your profile..." />;
  }

  return <>{children}</>;
}
