"use client";

import { useProfile } from "@/api/hooks/useAuth";
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
  const { data: user, isLoading, isError } = useProfile();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    // 🚫 Wait until loading finishes
    if (isLoading) return;

    // ❌ If error → logout
    if (isError) {
      dispatch(clearUser());
      router.replace("/login");
      return;
    }

    console.log("AuthInitializer user:", user);

    // ❌ No user → redirect
    if (!user) {
      router.replace("/login");
      return;
    }

    // ✅ Set user in store
    dispatch(setUser(user));

    // ✅ Redirect logged-in user away from login page
    if (pathname === "/login") {
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
