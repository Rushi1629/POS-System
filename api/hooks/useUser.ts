import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../services/user.service";

// export const useUsers = () => {
//   return useQuery({
//     queryKey: ["users"],
//     queryFn: getUsers,
//   });
// };

// export const useUser = (id: string) => {
//   return useQuery({
//     queryKey: ["user", id],
//     queryFn: () => getUserById(id),
//     enabled: !!id,
//   });
// };

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 🔥 important: refresh users list after create
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};