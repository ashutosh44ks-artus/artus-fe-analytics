"use client";

import { SessionAnalyticsTrendsDataSuccessResponse } from "@/services/session-analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/app/dashboard/components/TrendCard";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { FunnelChart, Funnel, LabelList, Tooltip, Cell } from "recharts";
import { PERIOD_LABELS, SessionAnalyticsTrendsPeriod } from "./utils";
import { formatMsToTime } from "@/lib/utils";
import { MdOutlineArrowRightAlt } from "react-icons/md";

type RetentionData =
  SessionAnalyticsTrendsDataSuccessResponse["trends"]["session_retention_over_time"];

interface SessionRetentionCardProps {
  retentionData: RetentionData | undefined;
  period: SessionAnalyticsTrendsPeriod;
}

const chartConfig = {
  users: {
    label: "Users",
    color: "#0ea5e9",
  },
} satisfies ChartConfig;

const MAX_VISIBLE_STEPS = 9;
const FUNNEL_COLORS = [
  "#67e8f9",
  "#22d3ee",
  "#06b6d4",
  "#0891b2",
  "#0e7490",
  "#155e75",
  "#164e63",
  "#083344",
  "#082f49",
];

const getSampledSteps = (data: RetentionData) => {
  if (data.length <= MAX_VISIBLE_STEPS) {
    return data;
  }

  const sampledIndices = new Set<number>([0, data.length - 1]);

  const rankedDropCandidates = data
    .map((item, index) => {
      if (index === 0 || index === data.length - 1) {
        return {
          index,
          stepRetentionPct: Infinity,
          usersDropped: -1,
        };
      }

      const prevUsers = data[index - 1]?.users ?? item.users;
      return {
        index,
        stepRetentionPct: item.step_retention_pct,
        usersDropped: Math.max(prevUsers - item.users, 0),
      };
    })
    .filter(
      (candidate) =>
        candidate.index !== 0 && candidate.index !== data.length - 1,
    )
    .sort((a, b) => {
      if (a.stepRetentionPct !== b.stepRetentionPct) {
        return a.stepRetentionPct - b.stepRetentionPct;
      }
      return b.usersDropped - a.usersDropped;
    });

  for (const candidate of rankedDropCandidates) {
    if (sampledIndices.size >= MAX_VISIBLE_STEPS) {
      break;
    }
    sampledIndices.add(candidate.index);
  }

  return Array.from(sampledIndices)
    .sort((a, b) => a - b)
    .map((index) => data[index]);
};

const SessionRetentionCard = ({
  retentionData,
  period,
}: SessionRetentionCardProps) => {
  const retentionSeries = retentionData ?? [];
  const hasData = retentionSeries.length > 0;
  const sampledRetentionData = hasData ? getSampledSteps(retentionSeries) : [];

  const funnelData = hasData
    ? sampledRetentionData.map((item, index) => ({
        name: `Session ${item.session_number}`,
        value: item.users,
        retention_pct: item.retention_pct,
        common_exit_path: item.common_exit_path,
        avg_session_duration_ms: item.avg_session_duration_ms,
        step_retention_pct: item.step_retention_pct,
        fill: FUNNEL_COLORS[index % FUNNEL_COLORS.length],
      }))
    : [];

  const firstStepUsers = hasData ? (retentionSeries[0]?.users ?? 0) : 0;
  const lastStepUsers = hasData
    ? (retentionSeries[retentionSeries.length - 1]?.users ?? 0)
    : 0;
  const powerUsers = hasData
    ? (retentionSeries.find((item) => item.session_number > 5)?.users ?? 0)
    : 0;
  const powerUsersPct =
    firstStepUsers > 0 ? (powerUsers / firstStepUsers) * 100 : null;

  const dropEntries = hasData
    ? retentionSeries
        .map((item, index, series) => {
          if (index === 0) {
            return null;
          }

          const prevUsers = series[index - 1]?.users ?? item.users;
          return {
            sessionNumber: item.session_number,
            usersDropped: Math.max(prevUsers - item.users, 0),
          };
        })
        .filter(
          (entry): entry is { sessionNumber: number; usersDropped: number } =>
            Boolean(entry),
        )
    : [];

  const maxUsersDropped =
    dropEntries.length > 0
      ? dropEntries.reduce(
          (maxDrop, entry) => Math.max(maxDrop, entry.usersDropped),
          0,
        )
      : 0;

  const largestDropSteps = dropEntries.filter(
    (entry) => entry.usersDropped === maxUsersDropped,
  );

  const topDropSessionPreview = largestDropSteps
    .slice(0, 3)
    .map((entry) => entry.sessionNumber)
    .join(", ");
  const hiddenTiedSessionsCount = Math.max(largestDropSteps.length - 3, 0);

  const totalUsersDropped = dropEntries.reduce(
    (sum, entry) => sum + entry.usersDropped,
    0,
  );
  const avgSessionToChurn =
    totalUsersDropped > 0
      ? dropEntries.reduce((sum, entry) => {
          const churnSessionNumber = Math.max(entry.sessionNumber - 1, 1);
          return sum + churnSessionNumber * entry.usersDropped;
        }, 0) / totalUsersDropped
      : null;

  return (
    <Card className="border-slate-800 bg-gray-900 text-slate-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Session Retention Funnel</CardTitle>
        <CardDescription className="mt-1 text-xs text-slate-400">
          Users retained across repeated sessions ({PERIOD_LABELS[period]})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <EmptyState message="No retention data available" />
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-md border border-slate-700/60 bg-slate-900/70 p-2">
                <p className="text-slate-400">Users (First & Last Step)</p>
                <p className="mt-1 text-sm font-semibold text-slate-100 flex items-center">
                  {firstStepUsers.toLocaleString()} <MdOutlineArrowRightAlt />{" "}
                  {lastStepUsers.toLocaleString()}
                </p>
              </div>
              <div className="rounded-md border border-slate-700/60 bg-slate-900/70 p-2">
                <p className="text-slate-400">Avg Sessions to Churn</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">
                  {avgSessionToChurn != null
                    ? avgSessionToChurn.toFixed(1)
                    : "N/A"}
                </p>
              </div>
              <div
                className="rounded-md border border-slate-700/60 bg-slate-900/70 p-2"
                title={
                  largestDropSteps.length > 0
                    ? `Largest drop (${maxUsersDropped.toLocaleString()} users) occurred in Sessions: ${largestDropSteps
                        .map((entry) => entry.sessionNumber)
                        .join(", ")}.`
                    : "Not enough sessions to compute drop-off."
                }
              >
                <p className="text-slate-400">Critical Drop-Off Sessions</p>
                <p className="mt-1 text-sm font-semibold">
                  {largestDropSteps.length > 0
                    ? `Session ${topDropSessionPreview}${hiddenTiedSessionsCount > 0 ? ` +${hiddenTiedSessionsCount} more` : ""}`
                    : "N/A"}
                </p>
              </div>
              <div
                className="rounded-md border border-slate-700/60 bg-slate-900/70 p-2"
                title="Users who had more than 5 sessions in the period."
              >
                <p className="text-slate-400">Power Users</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">
                  {powerUsers.toLocaleString()}
                  {powerUsersPct != null && ` (${powerUsersPct.toFixed(1)}%)`}
                </p>
              </div>
            </div>

            <ChartContainer config={chartConfig} className="h-80 w-full">
              <FunnelChart>
                <Tooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, _name, props) => {
                        const {
                          retention_pct,
                          step_retention_pct,
                          name,
                          common_exit_path,
                          avg_session_duration_ms,
                        } = props.payload ?? {};
                        return (
                          <div className="flex flex-col gap-0.5 text-xs">
                            <div className="flex gap-1 items-center">
                              <span className="font-semibold text-slate-50">
                                {name}
                              </span>
                              <span className="text-slate-300">
                                (
                                {value != null
                                  ? Number(value).toLocaleString()
                                  : "-"}{" "}
                                users)
                              </span>
                            </div>
                            {retention_pct != null && (
                              <span className="text-slate-400">
                                Drop since start: {retention_pct.toFixed(1)}%
                              </span>
                            )}
                            {step_retention_pct != null && (
                              <span className="text-slate-400">
                                Drop since last step:{" "}
                                {step_retention_pct.toFixed(1)}%
                              </span>
                            )}
                            {avg_session_duration_ms != null && (
                              <span className="text-slate-400">
                                Avg. Session Duration:{" "}
                                {formatMsToTime(avg_session_duration_ms)}
                              </span>
                            )}
                            {common_exit_path && (
                              <span className="text-slate-400">
                                Common Exit: {common_exit_path}
                              </span>
                            )}
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                  stroke="none"
                >
                  {funnelData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                  <LabelList
                    position="right"
                    fill="#cbd5e1"
                    stroke="none"
                    dataKey="name"
                    className="text-xs"
                  />
                  <LabelList
                    position="inside"
                    fill="#f8fafc"
                    stroke="none"
                    dataKey="value"
                    formatter={(value) =>
                      value != null ? Number(value).toLocaleString() : "-"
                    }
                    className="text-[11px] font-medium"
                  />
                </Funnel>
              </FunnelChart>
            </ChartContainer>
            {retentionSeries.length > MAX_VISIBLE_STEPS && (
              <p className="text-center text-xs text-slate-400">
                Showing {sampledRetentionData.length} out of{" "}
                {retentionSeries.length} sessions. Sessions are sampled to show
                the most significant drop-off points while ensuring the first
                and last sessions are always included.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionRetentionCard;
