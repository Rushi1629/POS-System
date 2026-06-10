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

  return res.data;
};
