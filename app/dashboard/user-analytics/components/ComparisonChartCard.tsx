import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  formatCompactMetricValue,
  formatTrendDateLabel,
  type UserAnalyticsMergedTrendDatum,
  type UserAnalyticsTrendsPeriod,
} from "./utils";
import EmptyChartState from "./EmptyChartState";

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
    <Card className="border-slate-800 bg-gray-900 text-slate-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-1 text-xs text-slate-400">
              {description}
            </CardDescription>
          </div>
          {badge ? (
            <Badge
              variant="outline"
              className="border-slate-700 text-[11px] text-slate-200"
            >
              {badge}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
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
                    strokeWidth={2.5}
                    dot={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            )}
          </ChartContainer>
        ) : (
          <EmptyChartState message="No trend data is available for this comparison yet." />
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonChartCard;
