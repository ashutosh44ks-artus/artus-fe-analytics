export const FilterOptions = [
  { value: "all", label: "All" },
  { value: "last_24_hours", label: "Day" },
  { value: "last_7_days", label: "Week" },
  { value: "last_30_days", label: "Month" },
] as const;
export type FilterOptionValue = (typeof FilterOptions)[number]["value"];