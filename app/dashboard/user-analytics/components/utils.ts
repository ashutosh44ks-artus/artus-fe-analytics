import type {
  UserAnalyticsMetric,
  UserAnalyticsTrendsDataSuccessResponse,
} from "@/services/user-analytics";
import { ChartConfig } from "@/components/ui/chart";

export const UserAnalyticsTrendsPeriodOptions = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
] as const;

export type UserAnalyticsTrendsPeriod =
  (typeof UserAnalyticsTrendsPeriodOptions)[number]["value"];

export type UserAnalyticsTrendPoint =
  UserAnalyticsTrendsDataSuccessResponse["data"]["chart_data"][number];

export type UserAnalyticsTrendsByMetric = Partial<
  Record<UserAnalyticsMetric, UserAnalyticsTrendPoint[]>
>;

export type UserAnalyticsMergedTrendDatum = {
  date: string;
} & Partial<Record<UserAnalyticsMetric, number>>;

export const USER_ANALYTICS_METRIC_META: Record<
  UserAnalyticsMetric,
  {
    label: string;
    shortLabel: string;
    description: string;
    color: string;
  }
> = {
  total_users: {
    label: "Total Users",
    shortLabel: "Users",
    description: "All registered users over time",
    color: "#f59e0b",
  },
  total_projects: {
    label: "Total Projects",
    shortLabel: "Projects",
    description: "Projects created by users over time",
    color: "#a855f7",
  },
  paid_users: {
    label: "Paid Users",
    shortLabel: "Paid",
    description: "Users with active subscriptions",
    color: "#22c55e",
  },
  dau: {
    label: "Daily Active Users",
    shortLabel: "DAU",
    description: "Users active in the last day",
    color: "#38bdf8",
  },
  wau: {
    label: "Weekly Active Users",
    shortLabel: "WAU",
    description: "Users active in the last week",
    color: "#0ea5e9",
  },
  mau: {
    label: "Monthly Active Users",
    shortLabel: "MAU",
    description: "Users active in the last month",
    color: "#6366f1",
  },
  partially_activated_users: {
    label: "Partially Activated Users",
    shortLabel: "Partial",
    description: "Users who started onboarding but did not finish",
    color: "#f97316",
  },
  fully_activated_users: {
    label: "Fully Activated Users",
    shortLabel: "Fully Active",
    description: "Users who completed onboarding and used the product",
    color: "#14b8a6",
  },
};
export const analyticsActiveUsersLabels = {
  weekly: {
    dau: {
      label: "Daily Active Users",
      description: "Unique users active on each day over the last 7 days.",
    },
    wau: {
      label: "Weekly Active Users",
      description:
        "Unique users active in the trailing 7-day window for each day shown.",
    },
    mau: {
      label: "Monthly Active Users",
      description:
        "Unique users active in the trailing 30-day window for each day shown.",
    },
  },
  monthly: {
    dau: {
      label: "Daily Active Users",
      description: "Unique users active on each day over the last 30 days.",
    },
    wau: {
      label: "Weekly Active Users",
      description:
        "Unique users active in the trailing 7-day window for each day shown.",
    },
    mau: {
      label: "Monthly Active Users",
      description:
        "Unique users active in the trailing 30-day window for each day shown.",
    },
  },
  yearly: {
    dau: {
      label: "Average Daily Active Users",
      description:
        "Average number of unique users active per day in each month.",
    },
    wau: {
      label: "Average Weekly Active Users",
      description:
        "Average number of unique users active per week in each month.",
    },
    mau: {
      label: "Monthly Active Users",
      description: "Unique users active during each calendar month.",
    },
  },
};

/**
 * Merges multiple trend series (one per metric) into a single array of data points keyed by date.
 * This is useful for rendering multiple metrics on the same chart with a shared x-axis.
 * @param metrics The list of metrics to merge.
 * @param data The trend data for each metric.
 * @returns An array of merged trend data points.
 */
export const mergeTrendSeriesByDate = (
  metrics: readonly UserAnalyticsMetric[],
  data: UserAnalyticsTrendsByMetric,
): UserAnalyticsMergedTrendDatum[] => {
  const merged = new Map<string, UserAnalyticsMergedTrendDatum>();

  metrics.forEach((metric) => {
    const series = data[metric] ?? [];

    series.forEach((point) => {
      const existing = merged.get(point.date) ?? { date: point.date };
      existing[metric] = point.count;
      merged.set(point.date, existing);
    });
  });

  return Array.from(merged.values()).sort(
    (left, right) =>
      new Date(left.date).getTime() - new Date(right.date).getTime(),
  );
};

export const buildChartConfig = (
  metrics: readonly UserAnalyticsMetric[],
): ChartConfig => {
  return metrics.reduce<ChartConfig>((config, metric) => {
    const meta = USER_ANALYTICS_METRIC_META[metric];

    config[metric] = {
      label: meta.shortLabel,
      color: meta.color,
    };

    return config;
  }, {});
};
