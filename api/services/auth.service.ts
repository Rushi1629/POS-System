import { fetcher } from "../client";

export const login = (data: { email: string; password: string }) =>
  fetcher("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMe = () => fetcher("/auth/me");

export const logout = () =>
  fetcher("/auth/logout", {
    method: "POST",
  });
