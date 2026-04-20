"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser, clearUser } from "@/store/user/authSlice";
import SecretCafeLoader from "@/components/SecretCafeLoader";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    } else {
      dispatch(clearUser());
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <SecretCafeLoader message="Checking session..." />;
  }

  return null;
}