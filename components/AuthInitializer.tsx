"use client";

import { useProfile } from "@/client/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
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

  // Disable profile fetch for public customer routes (QR-based sessions)
  // Profile is only needed for authenticated staff routes
  const isPublicCustomerRoute = pathname.startsWith("/customer");

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useProfile({ enabled: !isPublicCustomerRoute });

  useEffect(() => {
    if (user) {
      router.push("/user-management");
    }
  }, [user, router]);

  useEffect(() => {
    // Public routes that should NOT trigger profile fetch or redirects
    const publicPaths = ["/customer", "/login", "/register"];
    if (
      publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
    ) {
      return;
    }

    // Trigger the profile fetch when on protected routes.
    // refetch();

    // 🚫 Wait until loading finishes
    if (isLoading) return;

    // ❌ If error → logout (only redirect when not already on login/register)
    if (isError) {
      dispatch(clearUser());
      if (pathname !== "/login" && pathname !== "/register") {
        router.replace("/login");
      }
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
    dispatch(setUser(user));

    // ✅ Redirect logged-in user away from login page
    if (user && pathname === "/login") {
      router.replace("/user-management");
      return;
    }

    // ✅ Role-based route protection
    const findNavItem = navItems.find((item) => pathname.startsWith(item.href));

    if (
      findNavItem &&
      user?.role?.name &&
      !findNavItem.roles.includes(user.role.name)
    ) {
      router.replace("/unauthorized");
    }
  }, [pathname, user, isLoading, isError, router]);

  if (isLoading) {
    return <ApiLoader message="Loading your profile..." />;
  }

  return <>{children}</>;
}
