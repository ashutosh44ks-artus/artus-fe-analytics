import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  userAnalyticsMetricKeys,
  type UserAnalyticsSummaryDataSuccessResponse,
} from "@/services/user-analytics";
import {
  mergeTrendSeriesByDate,
  type UserAnalyticsTrendsByMetric,
  type UserAnalyticsTrendsPeriod,
} from "./utils";
import ComparisonChartCard from "./ComparisonChartCard";
import IndividualTrendCard from "./IndividualTrendCard";
import {
  formatMetricValue,
  formatPercentLabel,
} from "@/app/dashboard/components/utils";

interface UserAnalyticsContentProps {
  data: UserAnalyticsTrendsByMetric | undefined;
  summaryData: UserAnalyticsSummaryDataSuccessResponse["summary"] | undefined;
  period: UserAnalyticsTrendsPeriod;
  isLoading: boolean;
  error: unknown;
}

const UserAnalyticsContent = ({
  data,
  summaryData,
  period,
  isLoading,
  error,
}: UserAnalyticsContentProps) => {
  const hasAnyData = Object.values(data ?? {}).some(
    (series) => (series?.length ?? 0) > 0,
  );

  // Comparison charts data preparation
  const engagementData = useMemo(
    () => mergeTrendSeriesByDate(["dau", "wau", "mau", "new_signups"], data ?? {}),
    [data],
  );
  const activationData = useMemo(
    () =>
      mergeTrendSeriesByDate(
        ["total_users", "partially_activated_users", "fully_activated_users"],
        data ?? {},
      ),
    [data],
  );
  const monetizationData = useMemo(
    () => mergeTrendSeriesByDate(["total_users", "paid_users"], data ?? {}),
    [data],
  );
  const projectsData = useMemo(
    () => mergeTrendSeriesByDate(["total_projects"], data ?? {}),
    [data],
  );

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
        No user analytics trend data is available for the selected period yet.
      </div>
    );
  }

  // Badges for charts - show percentage labels where it provides meaningful context, otherwise fallback to period label
  const monetizationBadge =
    formatPercentLabel(
      summaryData?.paid_users,
      summaryData?.total_users,
      "paid",
    ) ?? period;
  const fullyActivatedBadge = formatPercentLabel(
    summaryData?.fully_activated_users,
    summaryData?.total_users,
    "fully",
  );
  const partiallyActivatedBadge = formatPercentLabel(
    summaryData?.partially_activated_users,
    summaryData?.total_users,
    "partial",
  );
  const activationBadge =
    fullyActivatedBadge && partiallyActivatedBadge
      ? `${fullyActivatedBadge} • ${partiallyActivatedBadge}`
      : (fullyActivatedBadge ?? partiallyActivatedBadge ?? period);
  const engagementBadge = summaryData
    ? `${formatMetricValue(summaryData.mau)} MAU`
    : period;
  const projectsBadge = summaryData
    ? `${formatMetricValue(summaryData.total_projects)} projects`
    : period;

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          Some trend series could not be loaded. Available data is shown below.
        </div>
      ) : null}

      <div>
        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase opacity-75">
          Meaningful Comparisons
        </p>
        <div className="grid gap-4 xl:grid-cols-2">
          <ComparisonChartCard
            title="Engagement Trends"
            description="Compare short-, medium-, and long-window engagement to understand retention and stickiness."
            metrics={["dau", "wau", "mau", "new_signups"]}
            chartData={engagementData}
            period={period}
            badge={engagementBadge}
          />
          <ComparisonChartCard
            title="Activation Trends"
            description="Compare total users with partially and fully activated users to see how onboarding conversion evolves over time."
            metrics={[
              "total_users",
              "partially_activated_users",
              "fully_activated_users",
            ]}
            chartData={activationData}
            period={period}
            badge={activationBadge}
          />
          <ComparisonChartCard
            title="Monetization Trends"
            description="Compare overall user growth with paid user growth to keep conversion visible."
            metrics={["total_users", "paid_users"]}
            chartData={monetizationData}
            period={period}
            badge={monetizationBadge}
          />
          <ComparisonChartCard
            title="Project Growth"
            description="Show how user activity translates into project creation across the selected timeframe."
            metrics={["total_projects"]}
            chartData={projectsData}
            period={period}
            badge={projectsBadge}
            variant="area"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase opacity-75">
          Individual Trends
        </p>
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {userAnalyticsMetricKeys.map((metric) => (
            <IndividualTrendCard
              key={metric}
              metric={metric}
              data={data ?? {}}
              period={period}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsContent;
