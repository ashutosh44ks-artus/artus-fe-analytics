"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import UserAnalyticsContent from "./components/UserAnalyticsContent";
import { AxiosError } from "axios";
import UserAnalyticsOverview from "./components/UserAnalyticsOverview";
import type { StatCardTrendDirection } from "@/app/dashboard/components/StatCard";
import {
  getUserAnalyticsSummaryData,
  getUserAnalyticsTrendsData,
  UserAnalyticsMetric,
  userAnalyticsDataQueryKeys,
  userAnalyticsMetricKeys,
  UserAnalyticsSummaryDataSuccessResponse,
} from "@/services/user-analytics";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserAnalyticsTrendsByMetric,
  UserAnalyticsTrendsPeriod,
  UserAnalyticsTrendsPeriodOptions,
} from "./components/utils";
import { useState } from "react";
import { getTrendDirection } from "@/app/dashboard/components/utils";

interface FilterSelectProps {
  label: string;
  value: UserAnalyticsTrendsPeriod;
  onChange: (value: UserAnalyticsTrendsPeriod) => void;
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
      onValueChange={(val) => onChange(val as UserAnalyticsTrendsPeriod)}
    >
      <SelectTrigger className={triggerClassName}>
        <div className="flex items-center gap-1">
          {showLabel && <span className="font-semibold">{label}:</span>}
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {UserAnalyticsTrendsPeriodOptions.map((option) => (
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
    useState<UserAnalyticsTrendsPeriod>("weekly");

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useQuery<UserAnalyticsSummaryDataSuccessResponse["summary"], AxiosError>({
    queryKey: userAnalyticsDataQueryKeys.summary(),
    queryFn: async () => {
      const response = await getUserAnalyticsSummaryData();
      return response.summary;
    },
  });

  const trendQueries = useQueries({
    queries: userAnalyticsMetricKeys.map((metric) => ({
      queryKey: userAnalyticsDataQueryKeys.trends(metric, trendsPeriod),
      queryFn: async () => {
        const response = await getUserAnalyticsTrendsData(metric, trendsPeriod);
        return response.data.chart_data;
      },
    })),
  });

  // Merge trend data into a single object keyed by metric for easier access in the content component
  const detailedData =
    userAnalyticsMetricKeys.reduce<UserAnalyticsTrendsByMetric>(
      (accumulator, metric, index) => {
        const series = trendQueries[index]?.data;
        if (series) {
          accumulator[metric] = series;
        }
        return accumulator;
      },
      {},
    );

  const trendDirections = userAnalyticsMetricKeys.reduce<
    Partial<Record<UserAnalyticsMetric, StatCardTrendDirection>>
  >((accumulator, metric) => {
    const direction = getTrendDirection(detailedData[metric]);

    if (direction) {
      accumulator[metric] = direction;
    }

    return accumulator;
  }, {});

  const isDetailedDataLoading = trendQueries.some((query) => query.isLoading);
  const detailedDataError =
    trendQueries.find((query) => query.error)?.error ?? null;

  return (
    <div className="min-h-0 flex-1 flex flex-col relative">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="font-semibold">User Analytics</span>
        </div>
        <FilterSelect
          label="Period"
          value={trendsPeriod}
          onChange={setTrendsPeriod}
          triggerClassName="w-36"
          showLabel
        />
      </header>
      <main className="p-4 flex-1">
        <UserAnalyticsOverview
          data={summaryData}
          isLoading={isSummaryLoading}
          error={summaryError}
          trendDirections={trendDirections}
        />
        <div>
          <UserAnalyticsContent
            data={detailedData}
            summaryData={summaryData}
            period={trendsPeriod}
            isLoading={isDetailedDataLoading}
            error={detailedDataError}
          />
        </div>
      </main>
    </div>
  );
};

export default Page;
