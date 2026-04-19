import { useMutation, useQuery } from "@tanstack/react-query";
import { login, getMe, logout } from "../services/auth.service";

export const useLogin = () =>
  useMutation({
    mutationFn: login,
  });

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

export const useLogout = () =>
  useMutation({
    mutationFn: logout,
  });