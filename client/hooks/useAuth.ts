import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, login, logout } from "../services/auth.service";
import { clearAuthCookies } from "../client";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      // 🔥 REMOVE OLD CACHE COMPLETELY
      queryClient.removeQueries({ queryKey: ["me"] });

      // 🔥 FORCE FETCH NEW PROFILE
      await queryClient.fetchQuery({
        queryKey: ["me"], 
        queryFn: fetchUserProfile,
      });
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
      console.log("❌ API ERROR", err);
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
