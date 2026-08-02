import { fetcher } from "../client";

export const login = (data: { email: string; password: string }) =>
  fetcher("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logout = () =>
  fetcher("/auth/logout", {
    method: "POST",
  });

export const fetchUserProfile = async () => {
  const res = await fetcher("/users/profile", {
    method: "GET",
  });

  const user = res?.data ?? res?.user ?? res;

  if (!user) {
    throw new Error("User profile not found");
  }

  return user;
};
