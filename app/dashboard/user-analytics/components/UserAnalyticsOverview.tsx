import { UserAnalyticsSummaryDataSuccessResponse } from "@/services/user-analytics";
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
import StatCard from "@/app/dashboard/components/StatCard";

interface UserAnalyticsProps {
  data: UserAnalyticsSummaryDataSuccessResponse["summary"] | undefined;
  isLoading: boolean;
  error: unknown;
}
const UserAnalyticsOverview = ({
  data,
  isLoading,
  error,
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
        Overview (all time)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatCard
          label="Total Users"
          value={data.total_users.toString()}
          subLabel="All registered users"
          Icon={Users}
          tone="amber"
        />
        <StatCard
          label="Daily Active Users (DAU)"
          value={data.dau.toString()}
          subLabel="Users active in the last day"
          Icon={Activity}
          tone="blue"
        />
        <StatCard
          label="Weekly Active Users (WAU)"
          value={data.wau.toString()}
          subLabel="Users active in the last week"
          Icon={CalendarDays}
          tone="blue"
        />
        <StatCard
          label="Monthly Active Users (MAU)"
          value={data.mau.toString()}
          subLabel="Users active in the last month"
          Icon={CalendarClock}
          tone="blue"
        />
        <StatCard
          label="Paid Users"
          value={data.paid_users.toString()}
          subLabel="Users with active subscriptions"
          Icon={CreditCard}
          tone="amber"
        />
        <StatCard
          label="Partially Activated Users"
          value={data.partially_activated_users.toString()}
          subLabel="Users that created a project but didn't generate any designs"
          Icon={UserMinus}
          tone="rose"
        />
        <StatCard
          label="Fully Activated Users"
          value={data.fully_activated_users.toString()}
          subLabel="Users that created a project and generated at least one design"
          Icon={UserCheck}
          tone="emerald"
        />
        <StatCard
          label="Total Projects"
          value={data.total_projects.toString()}
          subLabel="Projects created by users"
          Icon={FolderKanban}
          tone="blue"
        />
      </div>
    </div>
  );
};

export default UserAnalyticsOverview;
