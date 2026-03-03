import { cn } from "@/lib/utils";
import { LunaOverviewNestedData } from "@/services/dashboard";

const OverviewItemStat = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) => {
  return (
    <div className="flex flex-col items-end">
      <h3 className="font-semibold text-sm opacity-75 uppercase">{label}</h3>
      <div className={cn("text-2xl font-semibold", accent && "text-primary")}>
        {value}
      </div>
    </div>
  );
};

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
    return <div className="p-4">Loading...</div>;
  }
  if (error || !data) {
    return (
      <div className="p-4">Error loading data. Please try again later.</div>
    );
  }
  return (
    <main className="p-4 flex-1">
      <div className="flex flex-col gap-4">
        {data.overview_data.map(([key, value]) => {
          if (typeof value === "string") {
            return null; // Skip non-overview data
          }
          return (
            <div
              key={key}
              className="bg-gray-900 border rounded-lg p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{key}</h3>
                <p className="text-sm opacity-75">{value.Description}</p>
              </div>
              <div className="flex gap-4">
                <OverviewItemStat
                  label="Percentage"
                  value={`${value.percentage}%`}
                  accent
                />
                <OverviewItemStat label="Count" value={value.count} />
                <OverviewItemStat
                  label="Total Count"
                  value={value.total_count}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default OverviewContent;
