import { CreateUserPayload } from "@/types/types";
import { fetcher } from "../client";

export const createUser = (data: CreateUserPayload) =>
  fetcher("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
