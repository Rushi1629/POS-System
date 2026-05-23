import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, login, logout } from "../services/auth.service";

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
      queryClient.clear();
    },
  });
};

export const useProfile = (options?: any) => {
  return useQuery<any>({
    queryKey: ["me"],
    queryFn: fetchUserProfile,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0, // 🔥 IMPORTANT (always fresh)
    ...(options || {}),
  });
};
