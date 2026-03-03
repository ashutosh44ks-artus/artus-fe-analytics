import {
  PiCellTowerBold,
  PiChartBarFill,
  PiCheckCircleFill,
  PiGridFourFill,
} from "react-icons/pi";

export const SIDEBAR_ITEMS_ANALYTICS = [
  {
    key: "overview",
    label: "Overview",
    icon: PiGridFourFill,
  },
  {
    key: "retention",
    label: "Retention",
    icon: PiCheckCircleFill,
  },
  {
    key: "usage",
    label: "Usage",
    icon: PiChartBarFill,
  },
];
export const SIDEBAR_ITEMS_AI = [
  {
    key: "luna",
    label: "Luna",
    icon: PiCellTowerBold,
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
    isSidebarItemActive(item.key, currentPath)
  );
  return activeItem ? activeItem.label : "Dashboard";
};