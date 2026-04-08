import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type UserAnalyticsMetric } from "@/services/user-analytics";
import {
  buildChartConfig,
  type UserAnalyticsMergedTrendDatum,
  type UserAnalyticsTrendsPeriod,
} from "./utils";
import TrendCard, { EmptyState } from "@/app/dashboard/components/TrendCard";
import {
  formatCompactMetricValue,
  formatTrendDateLabel,
} from "@/app/dashboard/components/utils";

interface ComparisonChartCardProps {
  title: string;
  description: string;
  metrics: readonly UserAnalyticsMetric[];
  chartData: UserAnalyticsMergedTrendDatum[];
  period: UserAnalyticsTrendsPeriod;
  badge?: string | null;
  variant?: "line" | "area";
}
const ComparisonChartCard = ({
  title,
  description,
  metrics,
  chartData,
  period,
  badge,
  variant = "line",
}: ComparisonChartCardProps) => {
  const chartConfig = buildChartConfig(metrics);

  return (
    <TrendCard
      title={title}
      description={description}
      latestValue={null}
      badgeText={badge}
    >
      {chartData.length ? (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-65 w-full"
        >
          {variant === "area" ? (
            <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                tickFormatter={(value) =>
                  formatTrendDateLabel(String(value), period)
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={formatCompactMetricValue}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) =>
                      formatTrendDateLabel(String(value), period)
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {metrics.map((metric) => (
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={`var(--color-${metric})`}
                  fill={`var(--color-${metric})`}
                  fillOpacity={0.16}
                  strokeWidth={2}
                  connectNulls
                />
              ))}
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                tickFormatter={(value) =>
                  formatTrendDateLabel(String(value), period)
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={formatCompactMetricValue}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) =>
                      formatTrendDateLabel(String(value), period)
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {metrics.map((metric) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={`var(--color-${metric})`}
                  strokeWidth={metric === "total_users" ? 3 : 2.5}
                  strokeDasharray={
                    metrics.length > 2 && metric === "total_users"
                      ? "6 4"
                      : undefined
                  }
                  dot={false}
                  activeDot={{ r: metric === "total_users" ? 4 : 3 }}
                  connectNulls
                />
              ))}
            </LineChart>
          )}
        </ChartContainer>
      ) : (
        <EmptyState message="No trend data is available for this comparison yet." />
      )}
    </TrendCard>
  );
};

export default ComparisonChartCard;
