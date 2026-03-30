import { CustomerFeedbackDataSuccessResponse } from "@/services/customer-feedback";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  MessageSquareText,
  Star,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const StatCard = ({
  label,
  value,
  subLabel,
  Icon,
  tone,
}: {
  label: string;
  value: string;
  subLabel?: string;
  Icon: LucideIcon;
  tone: "amber" | "blue" | "emerald" | "rose";
}) => {
  const toneClasses = {
    amber: {
      border: "border-t-amber-500/40",
      iconWrap: "border-amber-500/40 bg-amber-500/10",
      icon: "text-amber-300",
      value: "text-amber-100",
    },
    blue: {
      border: "border-t-sky-500/40",
      iconWrap: "border-sky-500/40 bg-sky-500/10",
      icon: "text-sky-300",
      value: "text-sky-100",
    },
    emerald: {
      border: "border-t-emerald-500/40",
      iconWrap: "border-emerald-500/40 bg-emerald-500/10",
      icon: "text-emerald-300",
      value: "text-emerald-100",
    },
    rose: {
      border: "border-t-rose-500/40",
      iconWrap: "border-rose-500/40 bg-rose-500/10",
      icon: "text-rose-300",
      value: "text-rose-100",
    },
  } as const;
  const selectedTone = toneClasses[tone];

  return (
    <div
      className={cn(
        "bg-gray-900 border rounded-lg p-4 flex flex-col gap-1 border-t-2",
        selectedTone.border,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <span className={cn("rounded-md border p-1", selectedTone.iconWrap)}>
          <Icon className={cn("size-3.5", selectedTone.icon)} />
        </span>
      </div>
      <p className={cn("text-2xl font-semibold leading-none", selectedTone.value)}>{value}</p>
      {subLabel ? <p className="text-xs text-muted-foreground">{subLabel}</p> : null}
    </div>
  );
};

interface FeedbackContentProps {
  data: CustomerFeedbackDataSuccessResponse["feedback"] | undefined;
  isLoading: boolean;
  error: unknown;
}
const FeedbackOverview = ({ data, isLoading, error }: FeedbackContentProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const totalFeedbacks = data.length;
  const totalRating = data.reduce((acc, item) => acc + item.rating, 0);
  const averageRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0;
  const positiveFeedbackCount = data.filter((item) => item.rating >= 4).length;
  const lowRatingCount = data.filter((item) => item.rating <= 2).length;

  const positiveRate =
    totalFeedbacks > 0
      ? `${((positiveFeedbackCount / totalFeedbacks) * 100).toFixed(0)}%`
      : "0%";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
      <StatCard
        label="Average Rating"
        value={`${averageRating.toFixed(1)} / 5`}
        subLabel="Across all responses"
        Icon={Star}
        tone="amber"
      />
      <StatCard
        label="Total Feedbacks"
        value={totalFeedbacks.toString()}
        subLabel="Submitted by customers"
        Icon={MessageSquareText}
        tone="blue"
      />
      <StatCard
        label="Positive Feedback"
        value={positiveFeedbackCount.toString()}
        subLabel={`${positiveRate} rated 4 stars or above`}
        Icon={TrendingUp}
        tone="emerald"
      />
      <StatCard
        label="Needs Attention"
        value={lowRatingCount.toString()}
        subLabel="Rated 2 stars or below"
        Icon={AlertTriangle}
        tone="rose"
      />
    </div>
  );
};

export default FeedbackOverview;
