"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getLunaOverview } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import OverviewContent from "./components/OverviewContent";

export default function OverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const tempData = await getLunaOverview({
        filter_by_users: "all",
        filter_by_sessions: "all",
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
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-gray-900">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        Overview
      </header>
      <main className="p-4 flex-1">
        <OverviewContent data={data} isLoading={isLoading} error={error} />
      </main>
    </div>
  );
}
