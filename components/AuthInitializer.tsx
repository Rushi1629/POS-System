"use client";

import { useProfile } from "@/api/hooks/useAuth";
import SecretCafeLoader from "./SecretCafeLoader";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser, clearUser } from "@/store/auth/authSlice";
import ApiLoader from "./ApiLoader";

type Props = {
  children: React.ReactNode;
};

export default function AuthInitializer({ children }: Props) {
  const { data: user, isLoading, isError } = useProfile();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));

      if (pathname === "/login") {
        router.replace("/user-management");
      }
    }

    if (isError) {
      dispatch(clearUser());
      router.replace("/login");
    }
  }, [user, isError, router, dispatch]);

  if (isLoading) {
    return <ApiLoader message="Loading your profile..." />;
  }

  return <>{children}</>;
}
