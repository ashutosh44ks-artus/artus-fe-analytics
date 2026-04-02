import {
  dashboardQueryKeys,
  getLunaOverviewUserHeardFrom,
  LunaOverviewUserHeardFromList,
} from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";

const useHeardFrom = () => {
  const { data, isLoading, error } = useQuery<
    LunaOverviewUserHeardFromList["heard_from"],
    AxiosError
  >({
    queryKey: dashboardQueryKeys.heardFrom(),
    queryFn: async () => {
      const data = await getLunaOverviewUserHeardFrom();
      return data.heard_from;
    },
    placeholderData: [],
  });
  const heardFromOptions = useMemo(() => {
    const defaultValue = { label: "All", value: "all" };
    if (!Array.isArray(data)) return [defaultValue];
    if (data.length === 0) return [defaultValue];
    const heardFromSelectOptions = data.map((heardFrom) => ({
      label: heardFrom
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value: heardFrom,
    }));
    return [defaultValue, ...heardFromSelectOptions];
  }, [data]);

  return {
    data: heardFromOptions,
    isLoading,
    error,
  };
};

export default useHeardFrom;
