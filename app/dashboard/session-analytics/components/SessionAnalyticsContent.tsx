import { Skeleton } from "@/components/ui/skeleton";
import { type SessionAnalyticsTrendsPeriod } from "./utils";
import { SessionAnalyticsTrendsDataSuccessResponse } from "@/services/session-analytics";
import TrendCard, { EmptyState } from "@/app/dashboard/components/TrendCard";
import PageVisitsTableCard from "./PageVisitsTableCard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  formatCompactMetricValue,
  formatTrendDateLabel,
} from "@/app/dashboard/components/utils";

interface SessionAnalyticsContentProps {
  sessionData:
    | SessionAnalyticsTrendsDataSuccessResponse["trends"]["sessions_over_time"]
    | undefined;
  pageVisitData:
    | SessionAnalyticsTrendsDataSuccessResponse["trends"]["page_visits_over_time"]
    | undefined;
  period: SessionAnalyticsTrendsPeriod;
  isLoading: boolean;
  error: unknown;
}

const SessionAnalyticsContent = ({
  sessionData,
  pageVisitData,
  period,
  isLoading,
  error,
}: SessionAnalyticsContentProps) => {
  const hasAnyData = sessionData !== undefined && pageVisitData !== undefined;

  if (isLoading && !hasAnyData) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-90 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!hasAnyData && error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        Error loading trend data. Please try again later.
      </div>
    );
  }

  if (!hasAnyData) {
    return (
      <div className="rounded-lg border border-slate-800 bg-gray-900 p-4 text-sm text-slate-300">
        No session analytics trend data is available for the selected period
        yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          Trend series could not be loaded. Available data is shown below.
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <TrendCard
          title="Sessions Over Time"
          description={`Number of sessions over the ${period.split("_").join(" ")}.`}
        >
          {sessionData.length === 0 ? (
            <EmptyState message="No trend data is available yet." />
          ) : (
            <ChartContainer
              config={{
                count: {
                  label: "Sessions",
                },
              }}
              className="aspect-auto h-45 w-full"
            >
              <LineChart data={sessionData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={20}
                  tickFormatter={(value) =>
                    formatTrendDateLabel(String(value), period)
                  }
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tickFormatter={formatCompactMetricValue}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(value) =>
                        formatTrendDateLabel(String(value), period)
                      }
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={`var(--color-blue-900)`}
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ChartContainer>
          )}
        </TrendCard>
        <PageVisitsTableCard pageVisitData={pageVisitData} period={period} />
      </div>
    </div>
  );
};

export default SessionAnalyticsContent;
