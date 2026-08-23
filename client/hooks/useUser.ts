import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUserById,
  editUserById,
  fetchAllUsers,
  fetchRoles,
} from "../services/user.service";
import { Role, User } from "@/types/types";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};

export const useFetchUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useFetchRoles = () => {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUserById(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      editUserById(userId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};
