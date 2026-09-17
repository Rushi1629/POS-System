import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, login, logout } from "../services/auth.service";
import { clearAuthCookies } from "../client";
import { toast } from "sonner";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["me"] });

      await queryClient.fetchQuery({
        queryKey: ["me"], 
        queryFn: fetchUserProfile,
      });
    },
    onError: (err) => {
      toast.error("Login failed. Please check your credentials and try again.");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuthCookies();
      queryClient.clear();
      queryClient.removeQueries({ queryKey: ["me"] });
    },
    onError: (err) => {
      clearAuthCookies();
      queryClient.clear();
      toast.error("Failed to logout. Please try again.");
    },
  });
};

export const useProfile = (options?: any) => {
  return useQuery<any>({
    queryKey: ["me"],
    queryFn: fetchUserProfile,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 5 * 60 * 1000,
    ...(options || {}),
  });
};
