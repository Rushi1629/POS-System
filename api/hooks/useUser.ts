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
    mutationFn: (id: number) => deleteUserById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      editUserById(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
