"use client";

import { apiClient } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api/client";
import { getCookie } from "@/lib/cookies";

// Query Keys
export const lunaChatQueryKeys = {
  base: ["luna-chat"] as const,

  chat: (chatId: number | "new") =>
    [...lunaChatQueryKeys.base, "chat", chatId] as const,

  allChats: () => [...lunaChatQueryKeys.base, "all-chats"] as const,
};

// Luna Chat Types
export interface LunaChatByIdSuccessResponse {
  history: {
    type: "human" | "ai";
    content: string;
  }[];
}
export const getLunaChatById = async (
  chatId: number,
): Promise<LunaChatByIdSuccessResponse> => {
  const token = await getCookie("luna_auth_token");
  return await apiClient.post<LunaChatByIdSuccessResponse>(
    `/luna_chat_history`,
    {
      token: token,
      chat_id: chatId,
    },
  );
};

export interface LunaChatHistoryItemsSuccessResponse {
  chats: {
    chat_id: number;
    title: string;
  }[];
}
export const getLunaChatHistoryItems =
  async (): Promise<LunaChatHistoryItemsSuccessResponse> => {
    const token = await getCookie("luna_auth_token");
    return await apiClient.post<LunaChatHistoryItemsSuccessResponse>(
      `/luna_chats`,
      {
        token: token,
      },
    );
  };
export const postLunaChatMessage = async (
  userQuery: string,
  chatId: number | "new",
) => {
  const token = await getCookie("luna_auth_token");
  const response = await fetch(`${API_BASE_URL}/luna_chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
      chat_id: chatId,
      query: userQuery,
    }),
  });
  // not returning response data here because the streaming response is handled
  // in a custom way in the component using the ReadableStream API.
  // The full response data will be constructed incrementally in the component
  // as the stream is read.
  return response;
};
