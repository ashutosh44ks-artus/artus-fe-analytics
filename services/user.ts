"use client";

import { apiClient } from "@/lib/api";
import { getCookie } from "@/lib/cookies";

// Query Keys
export const userDataQueryKeys = {
  base: ["user"] as const,
};

// User Types
export type UserDataSuccessResponse = string;
export const getUserData = async (): Promise<UserDataSuccessResponse> => {
  const token = await getCookie("luna_auth_token");
  return await apiClient.post<UserDataSuccessResponse>(`/luna_user`, {
    token,
  });
};
