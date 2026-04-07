import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type UserAnalyticsMetric } from "@/services/user-analytics";
import {
  analyticsActiveUsersLabels,
  buildChartConfig,
  formatCompactMetricValue,
  formatMetricValue,
  formatTrendDateLabel,
  USER_ANALYTICS_METRIC_META,
  UserAnalyticsTrendPoint,
  type UserAnalyticsTrendsByMetric,
  type UserAnalyticsTrendsPeriod,
} from "./utils";
import EmptyChartState from "./EmptyChartState";
import { useMemo } from "react";

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

  return (
    <Card className="border-slate-800 bg-gray-900 text-slate-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{meta.label}</CardTitle>
            <CardDescription className="mt-1 text-xs text-slate-400">
              {meta.description}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="border-slate-700 text-[11px] text-slate-200"
          >
            {period}
          </Badge>
        </div>
        <p className="text-2xl font-semibold text-slate-50">
          {formatMetricValue(latestValue)}
        </p>
      </CardHeader>
      <CardContent>
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
          <EmptyChartState message="No individual trend data is available yet." />
        )}
      </CardContent>
    </Card>
  );
};

export default IndividualTrendCard;
