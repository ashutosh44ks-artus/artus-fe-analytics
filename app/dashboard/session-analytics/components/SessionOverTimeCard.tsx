import TrendCard, { EmptyState } from "@/app/dashboard/components/TrendCard";
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
import { SessionAnalyticsTrendsPeriod } from "./utils";
import { SessionAnalyticsTrendsDataSuccessResponse } from "@/services/session-analytics";

interface SessionOverTimeCardProps {
  sessionData:
    | SessionAnalyticsTrendsDataSuccessResponse["trends"]["sessions_over_time"]
    | undefined;
  period: SessionAnalyticsTrendsPeriod;
}

const SessionOverTimeCard = ({
  sessionData,
  period,
}: SessionOverTimeCardProps) => {
  return (
    <TrendCard
      title="Sessions Over Time"
      description={`Number of sessions over the ${period.split("_").join(" ")}.`}
    >
      {!sessionData || sessionData.length === 0 ? (
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
  );
};

export default SessionOverTimeCard;
