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
  all: (period: SessionAnalyticsTrendsPeriod) =>
    [...sessionAnalyticsDataQueryKeys.base, "all", period] as const,
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
    page_visits_over_time: {
      page: string;
      avg_duration: number;
      session_ends: number;
      total_visits: number;
      unique_visitors: number;
    }[];
    session_retention_over_time: {
      retention_pct: number;
      step_retention_pct: number;
      session_number: number;
      users: number;
      avg_session_duration_ms: number;
      common_exit_path: string;
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

export interface AggregatedSessionObject {
  user_id: string;
  user_name: string;
  session_number_for_this_user: number;
  total_time_this_session: number;
  session_details: {
    event_name: string;
    event_value: string | null;
    createdAt: string;
  }[];
}
export interface SessionAnalyticsAllDataSuccessResponse {
  success: boolean;
  sessions: AggregatedSessionObject[];
}
export const getSessionAnalyticsAllData = async (
  date_filter: SessionAnalyticsTrendsPeriod,
): Promise<SessionAnalyticsAllDataSuccessResponse> => {
  const token = await getCookie("luna_auth_token");
  return await apiClient.post<SessionAnalyticsAllDataSuccessResponse>(
    `/analytics/sessions/all`,
    {
      token,
      date_filter,
    },
  );
};
