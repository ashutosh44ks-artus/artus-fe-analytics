"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getLunaOverview } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import OverviewContent from "./components/OverviewContent";
import OverviewFilters from "./components/OverviewFilters";
import { useState } from "react";
import { FilterOptionValue } from "./components/utils";

export default function OverviewPage() {
  const [usersFilter, setUsersFilter] = useState<FilterOptionValue>("all");
  const [sessionsFilter, setSessionsFilter] =
    useState<FilterOptionValue>("all");
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "overview", usersFilter, sessionsFilter],
    queryFn: async () => {
      const tempData = await getLunaOverview({
        filter_by_users: usersFilter,
        filter_by_sessions: sessionsFilter,
      });
      const formattedData = {
        user_name: tempData.user_name,
        overview_data: Object.entries(tempData).filter(
          ([key]) => key !== "user_name",
        ),
      };
      return formattedData;
    },
  });

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          Overview
        </div>
        <OverviewFilters
          setUsersFilter={setUsersFilter}
          setSessionsFilter={setSessionsFilter}
        />
      </header>
      <main className="p-4 flex-1">
        <OverviewContent data={data} isLoading={isLoading} error={error} />
      </main>
    </div>
  );
}
