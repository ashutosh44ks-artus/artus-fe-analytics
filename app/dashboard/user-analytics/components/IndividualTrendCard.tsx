import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type UserAnalyticsMetric } from "@/services/user-analytics";
import {
  analyticsActiveUsersLabels,
  buildChartConfig,
  USER_ANALYTICS_METRIC_META,
  UserAnalyticsTrendPoint,
  type UserAnalyticsTrendsByMetric,
  type UserAnalyticsTrendsPeriod,
} from "./utils";
import { useMemo } from "react";
import TrendCard, { EmptyState } from "@/app/dashboard/components/TrendCard";
import {
  formatCompactMetricValue,
  formatMetricValue,
  formatTrendDateLabel,
} from "@/app/dashboard/components/utils";

const IndividualTrendCard = ({
  metric,
  data,
  period,
}: {
  metric: UserAnalyticsMetric;
  data: UserAnalyticsTrendsByMetric;
  period: UserAnalyticsTrendsPeriod;
}) => {
  const getLatestMetricValue = (series?: UserAnalyticsTrendPoint[]) =>
    series?.at(-1)?.count ?? null;

  const meta = useMemo(() => {
    if (["dau", "wau", "mau"].includes(metric)) {
      return analyticsActiveUsersLabels[period][
        metric as "dau" | "wau" | "mau"
      ];
    } else return USER_ANALYTICS_METRIC_META[metric];
  }, [metric, period]);
  const series = data[metric] ?? [];
  const latestValue = getLatestMetricValue(series);
  const normalizedSeries = series.map((point) => ({
    date: point.date,
    [metric]: point.count,
  }));
  console.log("hheh", metric, buildChartConfig([metric]))
  return (
    <TrendCard
      title={meta.label}
      description={meta.description}
      latestValue={formatMetricValue(latestValue)}
      badgeText={period}
    >
      {normalizedSeries.length ? (
        <ChartContainer
          config={buildChartConfig([metric])}
          className="aspect-auto h-45 w-full"
        >
          <LineChart data={normalizedSeries} margin={{ left: 8, right: 8 }}>
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
              dataKey={metric}
              stroke={`var(--color-${metric})`}
              strokeWidth={2.5}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      ) : (
        <EmptyState message="No individual trend data is available yet." />
      )}
    </TrendCard>
  );
};

export default IndividualTrendCard;
