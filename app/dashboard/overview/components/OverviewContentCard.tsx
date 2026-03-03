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
      <h3 className="font-semibold text-sm opacity-50 uppercase">{label}</h3>
      <div className={cn("text-2xl font-medium", accent && "text-primary")}>
        {value}
      </div>
    </div>
  );
};

interface OverviewContentCardProps {
  label: string;
  value: LunaOverviewNestedData;
}
const OverviewContentCard = ({ label, value }: OverviewContentCardProps) => {
  return (
    <div className="bg-gray-900 border rounded-lg p-6 flex sm:flex-row flex-col justify-between items-center gap-4">
      <div>
        <h3 className="font-semibold">{label}</h3>
        <p className="text-sm opacity-75">{value.Description}</p>
      </div>
      <div className="flex gap-4 shrink-0 sm:w-auto w-full justify-between">
        <OverviewItemStat
          label="Percentage"
          value={`${value.percentage}%`}
          accent
        />
        <OverviewItemStat label="Count" value={value.count} />
        <OverviewItemStat label="Total Count" value={value.total_count} />
      </div>
    </div>
  );
};

export default OverviewContentCard;
