
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, logout } from "../services/auth.service";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear(); // 🔥 clear all cache
    },
  });
};