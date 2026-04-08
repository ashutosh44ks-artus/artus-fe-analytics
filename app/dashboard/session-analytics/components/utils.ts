export const SessionAnalyticsTrendsPeriodOptions = [
  { label: "Last Week", value: "last_week" },
  { label: "Last Month", value: "last_month" },
  { label: "Last Year", value: "last_year" },
] as const;

export type SessionAnalyticsTrendsPeriod =
  (typeof SessionAnalyticsTrendsPeriodOptions)[number]["value"];
