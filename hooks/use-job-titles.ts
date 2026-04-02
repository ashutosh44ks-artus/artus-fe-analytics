import { dashboardQueryKeys, getLunaOverviewUserJobTitles, LunaOverviewUserJobTitleList } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";

const useJobTitles = () => {
  const { data, isLoading, error } = useQuery<
    LunaOverviewUserJobTitleList["job_titles"],
    AxiosError
  >({
    queryKey: dashboardQueryKeys.jobTitles(),
    queryFn: async () => {
      const data = await getLunaOverviewUserJobTitles();
      return data.job_titles;
    },
    placeholderData: [],
  });
  const jobTitleOptions = useMemo(() => {
    const defaultValue = { label: "All", value: "all" };
    if (!Array.isArray(data)) return [defaultValue];
    if (data.length === 0) return [defaultValue];
    const jobTitleSelectOptions = data.map((jobTitle) => ({
      label: jobTitle
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value: jobTitle,
    }));
    return [defaultValue, ...jobTitleSelectOptions];
  }, [data]);

  return {
    data: jobTitleOptions,
    isLoading,
    error,
  };
};

export default useJobTitles;
