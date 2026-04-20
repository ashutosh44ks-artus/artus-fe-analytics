export const FilterOptions = [
  { value: "all", label: "All" },
  { value: "last_24_hours", label: "Last 24 Hours" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
] as const;
export type FilterOptionValue = (typeof FilterOptions)[number]["value"];