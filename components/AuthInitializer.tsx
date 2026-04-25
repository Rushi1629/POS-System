"use client";

import { useProfile } from "@/api/hooks/useAuth";
import SecretCafeLoader from "./SecretCafeLoader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser, clearUser } from "@/store/auth/authSlice";

type Props = {
  children: React.ReactNode;
};

export default function AuthInitializer({ children }: Props) {
  const { data: user, isLoading, isError } = useProfile();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const roleRoutes: Record<string, string> = {
    admin: "/admin",
    manager: "/manager",
    cashier: "/pos",
  };

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
      const route = roleRoutes[user.role] || "/user";
      console.log("REDIRECTING TO:", route);
      router.replace(route);
    }

    if (isError) {
      dispatch(clearUser());
      router.replace("/login");
    }
  }, [user, isError, router, dispatch]);

  if (isLoading) {
    return <SecretCafeLoader message="Starting app..." />;
  }

  return <>{children}</>;
}
