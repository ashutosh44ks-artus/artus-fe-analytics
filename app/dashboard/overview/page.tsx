"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  getLunaOverview,
  dashboardQueryKeys,
  LunaOverviewErrorResponse,
  LunaOverviewFormattedData,
  LunaOverviewNestedData,
} from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import OverviewContent from "./components/OverviewContent";
import OverviewFilters from "./components/OverviewFilters";
import { useState } from "react";
import { FilterOptionValue } from "./components/utils";
import { AxiosError } from "axios";

export default function OverviewPage() {
  const [usersFilter, setUsersFilter] = useState<FilterOptionValue>("all");
  const [sessionsFilter, setSessionsFilter] =
    useState<FilterOptionValue>("all");
  const [jobTitlesFilter, setJobTitlesFilter] = useState<string>("all");
  const { data, isLoading, error } = useQuery<
    LunaOverviewFormattedData,
    AxiosError<LunaOverviewErrorResponse>
  >({
    queryKey: dashboardQueryKeys.overview(
      usersFilter,
      sessionsFilter,
      jobTitlesFilter,
    ),
    queryFn: async () => {
      const { user_name, ...rest } = await getLunaOverview({
        filter_by_users: usersFilter,
        filter_by_sessions: sessionsFilter,
        filter_by_job_title: jobTitlesFilter,
      });

      return {
        user_name,
        overview_data: Object.entries(
          rest as Record<string, LunaOverviewNestedData>,
        ),
      };
    },
  });

  return (
    <div className="min-h-0 flex-1 flex flex-col relative">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="font-semibold">Overview</span>
        </div>
        <OverviewFilters
          setUsersFilter={setUsersFilter}
          setSessionsFilter={setSessionsFilter}
          setJobTitlesFilter={setJobTitlesFilter}
        />
      </header>
      <main className="p-4 flex-1">
        <OverviewContent data={data} isLoading={isLoading} error={error} />
      </main>
    </div>
  );
}
