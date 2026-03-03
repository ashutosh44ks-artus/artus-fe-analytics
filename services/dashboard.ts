"use client";

import { apiClient } from "@/lib/api";
import { getCookie } from "@/lib/cookies";
import axios from "axios";

// Luna OTP Types
export type LunaOverviewSuccessResponse = {
  user_name: string;
} & {
  [key: string]:
    | {
        count: number;
        total_count: number;
        percentage: number;
        Description: string;
      }
    | string; // Must include string to allow user_name
};
export interface LunaOverviewErrorResponse {
  detail: string;
}
export type LunaOverviewResponse =
  | LunaOverviewSuccessResponse
  | LunaOverviewErrorResponse;

interface LunaOverviewParams {
  filter_by_users?: string;
  filter_by_sessions?: string;
}
export const getLunaOverview = async ({
  filter_by_users,
  filter_by_sessions,
}: LunaOverviewParams): Promise<LunaOverviewSuccessResponse> => {
  // const response: LunaOverviewResponse = await apiClient.post(`/luna_otp`, {});
  // return response;
  try {
    const token = await getCookie("luna_auth_token");
    const response = await apiClient.post<LunaOverviewSuccessResponse>(
      `/luna_overview`,
      {
        token,
        filter_by_users,
        filter_by_sessions,
      },
    );
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError<LunaOverviewErrorResponse>(error)) {
      throw error.response?.data; // goes to onError
    }
    throw new Error("Network error");
  }
};
