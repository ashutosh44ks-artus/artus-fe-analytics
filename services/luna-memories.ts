"use client";

import { apiClient } from "@/lib/api";
import { getCookie } from "@/lib/cookies";
import { lunaChatQueryKeys } from "./luna";

// Query Keys
export const lunaMemoriesQueryKeys = {
  base: [...lunaChatQueryKeys.base, "memories"] as const,
};

// Luna memories Types
export interface LunaMemoriesSuccessResponse {
  memory: {
    memory_id: number;
    created_at: string;
    memory_content: string;
  }[];
}
export const getLunaMemories =
  async (): Promise<LunaMemoriesSuccessResponse> => {
    const token = await getCookie("luna_auth_token");
    return await apiClient.post<LunaMemoriesSuccessResponse>(`/luna_memory`, {
      token: token,
    });
  };

export interface LunaMemoryDeleteSuccessResponse {
  success: boolean;
}
export const deleteLunaMemory = async (memoryId: number) => {
  const token = await getCookie("luna_auth_token");
  return await apiClient.post<LunaMemoryDeleteSuccessResponse>(
    `/luna_delete_memory`,
    {
      token: token,
      memory_id: memoryId,
    },
  );
};
