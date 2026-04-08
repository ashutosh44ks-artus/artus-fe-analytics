// import { USER_TEAMS } from "@/lib/constants";
import { UserStar } from "lucide-react";
import { MdEmail } from "react-icons/md";
import {
  PiCellTowerBold,
  // PiChartBarFill,
  // PiCheckCircleFill,
  PiGridFourFill,
} from "react-icons/pi";
import { VscFeedback, VscVmActive } from "react-icons/vsc";
import { parseISO, format } from "date-fns";
import { StatCardTrendDirection } from "./StatCard";

export const SIDEBAR_ITEMS_ANALYTICS = [
  {
    key: "overview",
    label: "Overview",
    icon: PiGridFourFill,
    disabled: false,
    team: "all",
  },
  // {
  //   key: "retention",
  //   label: "Retention",
  //   icon: PiCheckCircleFill,
  //   disabled: true,
  //   team: "all",
  // },
  // {
  //   key: "usage",
  //   label: "Usage",
  //   icon: PiChartBarFill,
  //   disabled: true,
  //   team: "all",
  // },
  {
    key: "customer-feedback",
    label: "Customer Feedback",
    icon: VscFeedback,
    disabled: false,
    team: "all",
  },
  {
    key: "bulk-emails",
    label: "Marketing Emails",
    icon: MdEmail,
    disabled: false,
    team: "all",
  },
  {
    key: "user-analytics",
    label: "User Analytics",
    icon: UserStar,
    disabled: false,
    team: "all",
  },
  {
    key: "session-analytics",
    label: "Session Analytics",
    icon: VscVmActive,
    disabled: false,
    team: "all",
  },
];
export const SIDEBAR_ITEMS_AI = [
  {
    key: "luna",
    label: "Luna",
    icon: PiCellTowerBold,
    disabled: false,
    team: "all",
  },
];
export const SIDEBAR_ITEMS = [
  {
    group: "Analytics",
    items: SIDEBAR_ITEMS_ANALYTICS,
  },
  {
    group: "AI Intelligence",
    items: SIDEBAR_ITEMS_AI,
  },
];

export const isSidebarItemActive = (itemKey: string, currentPath: string) => {
  return currentPath.includes(itemKey);
};

export const getPageTitle = (currentPath: string) => {
  const allItems = SIDEBAR_ITEMS.flatMap((section) => section.items);
  const activeItem = allItems.find((item) =>
    isSidebarItemActive(item.key, currentPath),
  );
  return activeItem ? activeItem.label : "Dashboard";
};

// Chart-Date Utils
// formats date labels for trends charts axes
// e.g. "Jan 5" for monthly, "Mon" for weekly, "Jan" for yearly
export const formatTrendDateLabel = (value: string, period: string) => {
  try {
    const parsedDate = parseISO(value);
    const isPeriodWeekly = period === "weekly" || period === "last_week";
    const isPeriodMonthly = period === "monthly" || period === "last_month";
    const pattern = isPeriodWeekly ? "EEE" : isPeriodMonthly ? "MMM d" : "MMM";

    return format(parsedDate, pattern);
  } catch {
    return value;
  }
};

// handles null and undefined values gracefully by returning "—" instead of "0" or "NaN"
// formats numbers with commas for thousands separators for better readability
export const formatMetricValue = (value: number | null | undefined) =>
  typeof value === "number" ? value.toLocaleString() : "—";

// handles rounding, formatting to compact notation (e.g., 1.2K, 3.4M), and gracefully handles non-numeric values
export const formatCompactMetricValue = (value: number | string) => {
  if (typeof value !== "number") {
    return value;
  }

  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatPercentLabel = (
  numerator?: number,
  denominator?: number,
  suffix?: string,
) => {
  if (
    typeof numerator !== "number" ||
    typeof denominator !== "number" ||
    denominator <= 0
  ) {
    return suffix ? `— ${suffix}` : "—";
  }

  const percent = Math.round((numerator / denominator) * 100);
  return suffix ? `${percent}% ${suffix}` : `${percent}%`;
};

export const getTrendDirection = (
  series?: {
    date: string;
    count: number;
  }[],
): StatCardTrendDirection | undefined => {
  if (!series || series.length < 2) {
    return undefined;
  }

  const previousCount = series.at(-2)?.count;
  const currentCount = series.at(-1)?.count;

  if (typeof previousCount !== "number" || typeof currentCount !== "number") {
    return undefined;
  }

  if (currentCount > previousCount) {
    return "up";
  }

  if (currentCount < previousCount) {
    return "down";
  }

  return "flat";
};
