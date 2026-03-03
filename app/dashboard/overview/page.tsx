"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getLunaOverview } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";

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

  if (isLoading) {
    return (
      <div>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          Overview
        </header>
        <div>Loading...</div>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          Overview
        </header>
        <div>Error loading data. Please try again later.</div>
      </div>
    );
  }
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
        {data.overview_data.map(([key, value]) => {
          if (typeof value === "string") {
            return null; // Skip non-overview data
          }
          return (
            <div key={key}>
              <div>
                <h3>{key}</h3>
                <p>{value.Description}</p>
              </div>
              <div className="flex">
                <div>
                  <div>Percentage</div>
                  <div>{value.percentage}%</div>
                </div>
                <div>
                  <div>Count</div>
                  <div>{value.count}</div>
                </div>
                <div>
                  <div>Total Count</div>
                  <div>{value.total_count}</div>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
