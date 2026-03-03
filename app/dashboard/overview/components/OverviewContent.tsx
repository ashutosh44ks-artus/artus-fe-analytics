import { Skeleton } from "@/components/ui/skeleton";
import { LunaOverviewNestedData } from "@/services/dashboard";
import OverviewContentCard from "./OverviewContentCard";

interface OverviewContentProps {
  data:
    | {
        user_name: string;
        overview_data: [string, string | LunaOverviewNestedData][];
      }
    | undefined;
  isLoading: boolean;
  error: unknown;
}
const OverviewContent = ({ data, isLoading, error }: OverviewContentProps) => {
  if (isLoading) {
    return (
      <div className="p-4 flex-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-26 w-full rounded-lg mb-4" />
        ))}
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="p-4 text-red-400">
        Error loading data. Please try again later.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {data.overview_data.map(([key, value]) => {
        if (typeof value === "string") {
          return null; // Skip non-overview data
        }
        return <OverviewContentCard key={key} label={key} value={value} />;
      })}
    </div>
  );
};

export default OverviewContent;
