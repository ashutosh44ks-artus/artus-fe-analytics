import {
  UserAnalyticsMetric,
  UserAnalyticsSummaryDataSuccessResponse,
} from "@/services/user-analytics";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  CalendarClock,
  CalendarDays,
  CreditCard,
  FolderKanban,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import StatCard, {
  type StatCardTrendDirection,
} from "@/app/dashboard/components/StatCard";

interface UserAnalyticsProps {
  data: UserAnalyticsSummaryDataSuccessResponse["summary"] | undefined;
  isLoading: boolean;
  error: unknown;
  trendDirections?: Partial<Record<UserAnalyticsMetric, StatCardTrendDirection>>;
}
const UserAnalyticsOverview = ({
  data,
  isLoading,
  error,
  trendDirections,
}: UserAnalyticsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  return (
    <div>
      <p className="mb-3 text-xs opacity-75 uppercase font-medium flex items-center gap-2">
        All Time Stats with Trend Indicators
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatCard
          label="Total Users"
          value={data.total_users.toString()}
          subLabel="All registered users"
          Icon={Users}
          tone="amber"
          trendDirection={trendDirections?.total_users}
        />
        <StatCard
          label="Daily Active Users (DAU)"
          value={data.dau.toString()}
          subLabel="Users active in the last day"
          Icon={Activity}
          tone="blue"
          trendDirection={trendDirections?.dau}
        />
        <StatCard
          label="Weekly Active Users (WAU)"
          value={data.wau.toString()}
          subLabel="Users active in the last week"
          Icon={CalendarDays}
          tone="blue"
          trendDirection={trendDirections?.wau}
        />
        <StatCard
          label="Monthly Active Users (MAU)"
          value={data.mau.toString()}
          subLabel="Users active in the last month"
          Icon={CalendarClock}
          tone="blue"
          trendDirection={trendDirections?.mau}
        />
        <StatCard
          label="Paid Users"
          value={data.paid_users.toString()}
          subLabel="Users with active subscriptions"
          Icon={CreditCard}
          tone="amber"
          trendDirection={trendDirections?.paid_users}
        />
        <StatCard
          label="Partially Activated Users"
          value={data.partially_activated_users.toString()}
          subLabel="Users that created a project but didn't generate any designs"
          Icon={UserMinus}
          tone="rose"
          trendDirection={trendDirections?.partially_activated_users}
        />
        <StatCard
          label="Fully Activated Users"
          value={data.fully_activated_users.toString()}
          subLabel="Users that created a project and generated at least one design"
          Icon={UserCheck}
          tone="emerald"
          trendDirection={trendDirections?.fully_activated_users}
        />
        <StatCard
          label="Total Projects"
          value={data.total_projects.toString()}
          subLabel="Projects created by users"
          Icon={FolderKanban}
          tone="blue"
          trendDirection={trendDirections?.total_projects}
        />
      </div>
    </div>
  );
};

export default UserAnalyticsOverview;
