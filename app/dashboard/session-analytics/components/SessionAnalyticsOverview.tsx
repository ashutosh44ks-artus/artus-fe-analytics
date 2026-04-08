import { Skeleton } from "@/components/ui/skeleton";
import { Activity, CalendarClock, FolderKanban, Users } from "lucide-react";
import StatCard from "@/app/dashboard/components/StatCard";
import { SessionAnalyticsSummaryDataSuccessResponse } from "@/services/session-analytics";
import { formatMsToTime } from "@/lib/utils";

interface SessionAnalyticsProps {
  data: SessionAnalyticsSummaryDataSuccessResponse["summary"] | undefined;
  isLoading: boolean;
  error: unknown;
}
const SessionAnalyticsOverview = ({
  data,
  isLoading,
  error,
}: SessionAnalyticsProps) => {
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
          label="Total Sessions"
          value={data.total_sessions.toString()}
          subLabel="All sessions recorded"
          Icon={Users}
          tone="amber"
        />
        <StatCard
          label="Avg. Session Duration"
          value={formatMsToTime(data.avg_session_length_ms)}
          subLabel="Average length of sessions"
          Icon={CalendarClock}
          tone="blue"
        />
        <StatCard
          label="Avg. Sessions per User"
          value={data.avg_sessions_per_user.toFixed(2)}
          subLabel="Average sessions per user"
          Icon={Activity}
          tone="emerald"
        />
        <StatCard
          label="Frequent Exit Page"
          value={data.common_exit_path}
          subLabel="Most common exit page"
          Icon={FolderKanban}
          tone="rose"
        />
      </div>
    </div>
  );
};

export default SessionAnalyticsOverview;
