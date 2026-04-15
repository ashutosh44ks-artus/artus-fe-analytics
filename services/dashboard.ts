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
    userPlansFilter: string,
  ) =>
    [
      ...dashboardQueryKeys.all,
      "overview",
      usersFilter,
      sessionsFilter,
      jobTitlesFilter,
      userPlansFilter,
    ] as const,

  jobTitles: () =>
    [...dashboardQueryKeys.all, "filters", "job-titles"] as const,

  heardFrom: () =>
    [...dashboardQueryKeys.all, "filters", "heard-from"] as const,
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
  filter_by_user_plan?: string;
}
export interface LunaOverviewFormattedData {
  user_name: string;
  overview_data: [string, LunaOverviewNestedData][];
}
export const getLunaOverview = async ({
  filter_by_users,
  filter_by_sessions,
  filter_by_job_title,
  filter_by_user_plan,
}: LunaOverviewParams): Promise<LunaOverviewSuccessResponse> => {
  const token = await getCookie("luna_auth_token");
  return await apiClient.post<LunaOverviewSuccessResponse>(`/luna_overview`, {
    token,
    filter_by_users,
    filter_by_sessions,
    filter_by_job_title,
    filter_by_user_plan,
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

export interface LunaOverviewUserHeardFromList {
  heard_from: string[];
}
export const getLunaOverviewUserHeardFrom =
  async (): Promise<LunaOverviewUserHeardFromList> => {
    const token = await getCookie("luna_auth_token");
    return await apiClient.post<LunaOverviewUserHeardFromList>(
      `/luna_heard_from`,
      {
        token,
      },
    );
  };
  