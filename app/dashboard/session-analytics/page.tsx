"use client";

import { useQuery } from "@tanstack/react-query";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AxiosError } from "axios";
import SessionAnalyticsOverview from "./components/SessionAnalyticsOverview";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SessionAnalyticsTrendsPeriod,
  SessionAnalyticsTrendsPeriodOptions,
} from "./components/utils";
import { useState } from "react";
import {
  getSessionAnalyticsSummaryData,
  getSessionAnalyticsTrendsData,
  sessionAnalyticsDataQueryKeys,
  SessionAnalyticsSummaryDataSuccessResponse,
  SessionAnalyticsTrendsDataSuccessResponse,
} from "@/services/session-analytics";
import SessionAnalyticsContent from "./components/SessionAnalyticsContent";

interface FilterSelectProps {
  label: string;
  value: SessionAnalyticsTrendsPeriod;
  onChange: (value: SessionAnalyticsTrendsPeriod) => void;
  triggerClassName?: string;
  showLabel?: boolean;
}
const FilterSelect = ({
  label,
  value,
  onChange,
  triggerClassName = "w-36",
  showLabel = false,
}: FilterSelectProps) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as SessionAnalyticsTrendsPeriod)}
    >
      <SelectTrigger className={triggerClassName}>
        <div className="flex items-center gap-1">
          {showLabel && <span className="font-semibold">{label}:</span>}
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {SessionAnalyticsTrendsPeriodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const Page = () => {
  const [trendsPeriod, setTrendsPeriod] =
    useState<SessionAnalyticsTrendsPeriod>("last_week");

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useQuery<
    SessionAnalyticsSummaryDataSuccessResponse["summary"],
    AxiosError
  >({
    queryKey: sessionAnalyticsDataQueryKeys.summary(),
    queryFn: async () => {
      const response = await getSessionAnalyticsSummaryData();
      return response.summary;
    },
  });

  const {
    data: trendsData,
    isLoading: isTrendsLoading,
    error: trendsError,
  } = useQuery<SessionAnalyticsTrendsDataSuccessResponse["trends"], AxiosError>(
    {
      queryKey: sessionAnalyticsDataQueryKeys.trends(trendsPeriod),
      queryFn: async () => {
        const response = await getSessionAnalyticsTrendsData(trendsPeriod);
        return response.trends;
      },
    },
  );

  return (
    <div className="min-h-0 flex-1 flex flex-col relative">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="font-semibold">Session Analytics</span>
        </div>
        <FilterSelect
          label="Period"
          value={trendsPeriod}
          onChange={setTrendsPeriod}
          triggerClassName="w-40"
          showLabel
        />
      </header>
      <main className="p-4 flex-1">
        <SessionAnalyticsOverview
          data={summaryData}
          isLoading={isSummaryLoading}
          error={summaryError}
        />
        <div>
          <SessionAnalyticsContent
            sessionData={trendsData?.sessions_over_time}
            pageVisitData={trendsData?.page_visits_over_time}
            retentionData={trendsData?.session_retention_over_time}
            period={trendsPeriod}
            isLoading={isTrendsLoading}
            error={trendsError}
          />
        </div>
      </main>
    </div>
  );
};

export default Page;
