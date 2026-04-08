"use client";

import { SessionAnalyticsTrendsPeriod } from "@/app/dashboard/session-analytics/components/utils";
import { apiClient } from "@/lib/api";
import { getCookie } from "@/lib/cookies";

// Query Keys
export const sessionAnalyticsDataQueryKeys = {
  base: ["session-analytics"] as const,
  summary: () => [...sessionAnalyticsDataQueryKeys.base, "summary"] as const,
  trends: (period: SessionAnalyticsTrendsPeriod) =>
    [...sessionAnalyticsDataQueryKeys.base, "trends", period] as const,
};

// Session Types
export interface SessionAnalyticsSummaryDataSuccessResponse {
  success: boolean;
  summary: {
    total_sessions: number;
    avg_session_length_ms: number;
    avg_sessions_per_user: number;
    common_exit_path: string;
    unique_users: number;
  };
}
export const getSessionAnalyticsSummaryData =
  async (): Promise<SessionAnalyticsSummaryDataSuccessResponse> => {
    const token = await getCookie("luna_auth_token");
    return await apiClient.post<SessionAnalyticsSummaryDataSuccessResponse>(
      `/analytics/sessions/summary`,
      {
        token,
      },
    );
  };

export interface SessionAnalyticsTrendsDataSuccessResponse {
  success: boolean;
  trends: {
    date_filter: SessionAnalyticsTrendsPeriod;
    start_date: string;
    end_date: string;
    sessions_over_time: {
      date: string;
      count: number;
    }[];
  };
}
export const getSessionAnalyticsTrendsData = async (
  date_filter: SessionAnalyticsTrendsPeriod,
): Promise<SessionAnalyticsTrendsDataSuccessResponse> => {
  const token = await getCookie("luna_auth_token");
  return await apiClient.post<SessionAnalyticsTrendsDataSuccessResponse>(
    `/analytics/sessions/trends`,
    {
      token,
      date_filter,
    },
  );
};
