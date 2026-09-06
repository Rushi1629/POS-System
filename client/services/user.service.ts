import {
  CreateUserPayload,
  FetchUsersParams,
  Role,
  User,
  UsersResponse,
} from "@/types/types";
import { fetcher } from "../client";

export const createUser = (data: CreateUserPayload) =>
  fetcher("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchAllUsers = async ({
  page,
  limit,
  search = "",
  status,
}: FetchUsersParams): Promise<UsersResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  if (status) params.set("status", status);

  const res: UsersResponse = await fetcher(`/users?${params.toString()}`);

  return {
    ...res,
    data: (res.data ?? []).map((u: any) => ({
      ...u,
      userId: String(u.userId),
      roleId: String(u.role?.roleId),
      role: u.role?.name,
    })),
    pagination: res.pagination ?? {
      page,
      limit,
      total: res.data?.length ?? 0,
      totalPages: 1,
    },
  };
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
