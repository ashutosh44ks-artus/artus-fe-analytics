"use client";

import { UserAnalyticsTrendsPeriod } from "@/app/dashboard/user-analytics/components/utils";
import { apiClient } from "@/lib/api";
import { getCookie } from "@/lib/cookies";

// User Types
export interface UserAnalyticsSummaryDataSuccessResponse {
  success: boolean;
  summary: {
    total_users: number;
    total_projects: number;
    paid_users: number;
    dau: number;
    wau: number;
    mau: number;
    partially_activated_users: number;
    fully_activated_users: number;
  };
}

export type UserAnalyticsMetric =
  keyof UserAnalyticsSummaryDataSuccessResponse["summary"];

export const userAnalyticsMetricKeys = [
  "total_users",
  "total_projects",
  "paid_users",
  "dau",
  "wau",
  "mau",
  "partially_activated_users",
  "fully_activated_users",
] as const satisfies readonly UserAnalyticsMetric[];

// Query Keys
export const userAnalyticsDataQueryKeys = {
  base: ["user-analytics"] as const,
  summary: () => [...userAnalyticsDataQueryKeys.base, "summary"] as const,
  trends: (metric: UserAnalyticsMetric, period: UserAnalyticsTrendsPeriod) =>
    [...userAnalyticsDataQueryKeys.base, "trends", metric, period] as const,
};

export const getUserAnalyticsSummaryData =
  async (): Promise<UserAnalyticsSummaryDataSuccessResponse> => {
    const token = await getCookie("luna_auth_token");
    return await apiClient.post<UserAnalyticsSummaryDataSuccessResponse>(
      `/analytics/summary`,
      {
        token,
      },
    );
  };

export interface UserAnalyticsTrendsDataSuccessResponse {
  success: boolean;
  data: {
    period: UserAnalyticsTrendsPeriod;
    metric: UserAnalyticsMetric;
    chart_data: {
      date: string;
      count: number;
    }[];
  };
}
export const getUserAnalyticsTrendsData = async (
  metric: UserAnalyticsMetric,
  period: UserAnalyticsTrendsPeriod,
): Promise<UserAnalyticsTrendsDataSuccessResponse> => {
  const token = await getCookie("luna_auth_token");
  return await apiClient.post<UserAnalyticsTrendsDataSuccessResponse>(
    `/analytics/trends`,
    {
      token,
      period,
      metric,
    },
  );
};
