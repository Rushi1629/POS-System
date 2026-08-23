import { CreateUserPayload, Role, User } from "@/types/types";
import { fetcher } from "../client";

export const createUser = (data: CreateUserPayload) =>
  fetcher("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchAllUsers = async (): Promise<User[]> => {
  const res = await fetcher("/users");

  return res.data.map((u: any) => ({
    ...u,
    userId: u.userId,
    roleId: u.role.roleId,
    role: u.role.name,
  }));
};

export const fetchRoles = async (): Promise<Role[]> => {
  const res = await fetcher("/roles");
  return res.data;
};

export const deleteUserById = async (userId: string): Promise<void> => {
  await fetcher(`/users/${userId}`, {
    method: "DELETE",
  });
};
export const editUserById = async (
  userId: string,
  data: Partial<User>,
): Promise<User> => {
  const res = await fetcher(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return res.data;
};
