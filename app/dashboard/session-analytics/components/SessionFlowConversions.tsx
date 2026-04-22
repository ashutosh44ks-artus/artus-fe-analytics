import React, { useMemo } from "react";
import { SessionAnalyticsTrendsPeriod } from "./utils";
import {
  AggregatedSessionObject,
  SessionAnalyticsAllDataSuccessResponse,
} from "@/services/session-analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PageConversion {
  from: {
    page: string;
    count: number;
  };
  to: {
    page: string;
    count: number;
  }[];
  actions: {
    event: string;
    count: number;
  }[];
}

function Arrow({
  theme = "primary",
  percentage,
}: {
  theme?: "primary" | "blue";
  percentage?: number;
}) {
  const bgColor = theme === "primary" ? "bg-primary-500" : "bg-blue-300";
  const borderColor =
    theme === "primary" ? "border-l-primary-500" : "border-l-blue-300";
  return (
    <div className="flex-1 flex items-center relative">
      <div className={`flex-1 h-px ${bgColor}`} />
      {/* percentage in middle */}
      {percentage !== undefined && (
        <div
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs px-1 rounded",
            theme === "primary"
              ? "bg-primary-700 text-white"
              : "bg-blue-300 text-black",
          )}
        >
          {percentage.toFixed(1)}%
        </div>
      )}
      <div
        className={`w-0 h-0 border-y-[5px] border-y-transparent border-l-8 ${borderColor}`}
      />
    </div>
  );
}

interface ProbabilityWeightedFlowJourneyCardProps {
  period: SessionAnalyticsTrendsPeriod;
  userSessions: SessionAnalyticsAllDataSuccessResponse["sessions"] | undefined;
}
function calculatePageConversions(
  sessions: AggregatedSessionObject[],
): PageConversion[] {
  const conversionsMap: Record<string, PageConversion> = {};
  sessions.forEach((session) => {
    const pageViews = session.session_details.filter(
      (detail) => detail.event_name === "page_visit",
    );
    const buttonClicks = session.session_details.filter(
      (detail) => detail.event_name === "button_click",
    );

    pageViews.forEach((view, index) => {
      const fromPage = view.event_value || "Unknown";
      const toPage = pageViews[index + 1]?.event_value || "Exit";
      if (!conversionsMap[fromPage]) {
        conversionsMap[fromPage] = {
          from: { page: fromPage, count: 0 },
          to: [],
          actions: [],
        };
      }
      conversionsMap[fromPage].from.count += 1;
      let toEntry = conversionsMap[fromPage].to.find(
        (to) => to.page === toPage,
      );
      if (!toEntry) {
        toEntry = { page: toPage, count: 0 };
        conversionsMap[fromPage].to.push(toEntry);
      }
      toEntry.count += 1;
    });
    buttonClicks.forEach((click) => {
      const event = click.event_value || "Unknown__Unknown";
      // format is PageName__ButtonName, e.g. Homepage__Clicked Signup
      const [page, button] = event.split("__");
      if (!conversionsMap[page]) {
        conversionsMap[page] = {
          from: { page, count: 0 },
          to: [],
          actions: [],
        };
      }
      let actionEntry = conversionsMap[page].actions.find(
        (action) => action.event === button,
      );
      if (!actionEntry) {
        actionEntry = { event: button, count: 0 };
        conversionsMap[page].actions.push(actionEntry);
      }
      actionEntry.count += 1;
    });
  });
  return Object.values(conversionsMap);
}

const SessionFlowConversions = ({
  // period,
  userSessions,
}: ProbabilityWeightedFlowJourneyCardProps) => {
  const pageConversions = useMemo<PageConversion[]>(() => {
    if (!userSessions) return [];
    return calculatePageConversions(userSessions);
  }, [userSessions]);

  return (
    <Card className="border-slate-800 bg-gray-900 text-slate-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">User Flow Conversions</CardTitle>
        <CardDescription className="mt-1 text-xs text-slate-400">
          Each section below shows how users transition from one page to the
          next, along with conversion rates. It also highlights key button
          clicks that drive users forward in their journey. The data is filtered
          to top 3 next pages and actions for clarity.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {pageConversions.map((conversion) => {
          const sortedToPages = [...conversion.to].sort(
            (a, b) => b.count - a.count,
          );
          const exitDestination = sortedToPages.find(
            (to) => to.page === "Exit",
          );
          const top3ToPages = exitDestination
            ? [
                exitDestination,
                ...sortedToPages.filter((to) => to.page !== "Exit").slice(0, 2),
              ]
            : sortedToPages.slice(0, 3);
          const top3Actions = conversion.actions
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
          if (top3ToPages.length === 0 && top3Actions.length === 0) {
            return null; // skip if no transitions or actions
          }
          return (
            <div
              key={conversion.from.page}
              className="flex items-center gap-3 bg-slate-900 p-2 rounded border"
            >
              {/* From box */}
              <div className="shrink-0 w-48 bg-slate-800 p-3 rounded border border-slate-700">
                <div className="text-xs opacity-75 uppercase tracking-wide">
                  Entry Point
                </div>
                <div className="text-base font-medium mt-0.5 truncate">
                  {conversion.from.page}
                </div>
                <div className="text-xs opacity-75 mt-0.5 flex items-center gap-1">
                  {conversion.from.count} sessions
                </div>
              </div>
              {/* Arrows + destination boxes */}
              <div className="flex-1 flex flex-col gap-2">
                {top3ToPages.map((to) => {
                  const conversionRate =
                    conversion.from.count > 0
                      ? (to.count / conversion.from.count) * 100
                      : 0;
                  return (
                    <div key={to.page} className="flex items-center">
                      <Arrow percentage={conversionRate} />
                      <div className="text-xs font-medium truncate ml-2 w-52 shrink-0 bg-slate-800 p-2 rounded border border-slate-700">
                        {to.page}
                      </div>
                    </div>
                  );
                })}
                {top3Actions.map((action) => {
                  const actionRate =
                    conversion.from.count > 0
                      ? (action.count / conversion.from.count) * 100
                      : 0;
                  return (
                    <div key={action.event} className="flex items-center">
                      <Arrow theme="blue" percentage={actionRate} />
                      <div className="text-xs font-medium truncate ml-2 w-52 shrink-0 bg-slate-800 p-2 rounded border border-slate-700">
                        {action.event}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {pageConversions.length === 0 && (
          <p>No session data available for the selected period.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionFlowConversions;
