"use client";

import { apiClient } from "@/lib/api";
import { getCookie } from "@/lib/cookies";

// Query Keys
export const dashboardQueryKeys = {
  all: ["dashboard"] as const,

  overview: (
    usersFilter: string,
    sessionsFilter: string,
    jobTitlesFilter: string,
  ) =>
    [
      ...dashboardQueryKeys.all,
      "overview",
      usersFilter,
      sessionsFilter,
      jobTitlesFilter,
    ] as const,

  jobTitles: () =>
    [...dashboardQueryKeys.all, "filters", "job-titles"] as const,
};

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
  filter_by_job_title?: string;
}
export interface LunaOverviewFormattedData {
  user_name: string;
  overview_data: [string, LunaOverviewNestedData][];
}
export const getLunaOverview = async ({
  filter_by_users,
  filter_by_sessions,
  filter_by_job_title,
}: LunaOverviewParams): Promise<LunaOverviewSuccessResponse> => {
  const token = await getCookie("luna_auth_token");
  return await apiClient.post<LunaOverviewSuccessResponse>(`/luna_overview`, {
    token,
    filter_by_users,
    filter_by_sessions,
    filter_by_job_title,
  });
};

export interface LunaOverviewUserJobTitleList {
  job_titles: string[];
}
export const getLunaOverviewUserJobTitles =
  async (): Promise<LunaOverviewUserJobTitleList> => {
    const token = await getCookie("luna_auth_token");
    return await apiClient.post<LunaOverviewUserJobTitleList>(
      `/luna_job_titles`,
      {
        token,
      },
    );
  };
