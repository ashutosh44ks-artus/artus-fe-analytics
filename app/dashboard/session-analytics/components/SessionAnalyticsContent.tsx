import { Skeleton } from "@/components/ui/skeleton";
import { type SessionAnalyticsTrendsPeriod } from "./utils";
import { SessionAnalyticsAllDataSuccessResponse, SessionAnalyticsTrendsDataSuccessResponse } from "@/services/session-analytics";
import PageVisitsTableCard from "./PageVisitsTableCard";
import SessionRetentionCard from "./SessionRetentionCard";
import SessionOverTimeCard from "./SessionOverTimeCard";
import SessionFlowConversions from "./SessionFlowConversions";
import SessionButtonClickBreakdown from "./SessionButtonClickBreakdown";

interface SessionAnalyticsContentProps {
  sessionData:
    | SessionAnalyticsTrendsDataSuccessResponse["trends"]["sessions_over_time"]
    | undefined;
  pageVisitData:
    | SessionAnalyticsTrendsDataSuccessResponse["trends"]["page_visits_over_time"]
    | undefined;
  retentionData:
    | SessionAnalyticsTrendsDataSuccessResponse["trends"]["session_retention_over_time"]
    | undefined;
  userSessions: SessionAnalyticsAllDataSuccessResponse["sessions"] | undefined;
  buttonClickData:
    | SessionAnalyticsTrendsDataSuccessResponse["trends"]["button_click_breakdown"]
    | undefined;
  period: SessionAnalyticsTrendsPeriod;
  isLoading: boolean;
  error: unknown;
}

const SessionAnalyticsContent = ({
  sessionData,
  pageVisitData,
  retentionData,
  userSessions,
  buttonClickData,
  period,
  isLoading,
  error,
}: SessionAnalyticsContentProps) => {
  const hasAnyData = sessionData !== undefined && pageVisitData !== undefined;

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
        No session analytics trend data is available for the selected period
        yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          Trend series could not be loaded. Available data is shown below.
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <SessionOverTimeCard sessionData={sessionData} period={period} />
        <SessionRetentionCard retentionData={retentionData} period={period} />
        <PageVisitsTableCard pageVisitData={pageVisitData} period={period} />
        <SessionButtonClickBreakdown buttonClickData={buttonClickData} period={period} />
        <SessionFlowConversions userSessions={userSessions} period={period} />
      </div>
    </div>
  );
};

export default SessionAnalyticsContent;
