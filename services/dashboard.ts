"use client";

import { apiClient } from "@/lib/api";
import { getCookie } from "@/lib/cookies";

// Luna OTP Types
export type LunaOverviewNestedData = {
  count: number;
  total_count: number;
  percentage: number;
  Description: string;
};
export type LunaOverviewSuccessResponse = {
  user_name: string;
} & {
  [K in string]: K extends "user_name" ? string : LunaOverviewNestedData;
};
export interface LunaOverviewErrorResponse {
  detail: string;
}
interface LunaOverviewParams {
  filter_by_users?: string;
  filter_by_sessions?: string;
}
export interface LunaOverviewFormattedData {
  user_name: string;
  overview_data: [string, LunaOverviewNestedData][];
}
export const getLunaOverview = async ({
  filter_by_users,
  filter_by_sessions,
}: LunaOverviewParams): Promise<LunaOverviewSuccessResponse> => {
  const token = await getCookie("luna_auth_token");
  return await apiClient.post<LunaOverviewSuccessResponse>(`/luna_overview`, {
    token,
    filter_by_users,
    filter_by_sessions,
  });
};
