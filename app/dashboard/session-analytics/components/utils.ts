export const SessionAnalyticsTrendsPeriodOptions = [
  { label: "Last Week", value: "last_week" },
  { label: "Last Month", value: "last_month" },
  { label: "Last Year", value: "last_year" },
] as const;

export type SessionAnalyticsTrendsPeriod =
  (typeof SessionAnalyticsTrendsPeriodOptions)[number]["value"];

export const PERIOD_LABELS: Record<SessionAnalyticsTrendsPeriod, string> = {
  last_week: "Last Week",
  last_month: "Last Month",
  last_year: "Last Year",
};
