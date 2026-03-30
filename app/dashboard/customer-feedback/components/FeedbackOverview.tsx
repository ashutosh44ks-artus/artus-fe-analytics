import { CustomerFeedbackDataSuccessResponse } from "@/services/customer-feedback";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({
  label,
  value,
  subLabel,
}: {
  label: string;
  value: string;
  subLabel?: string;
}) => {
  return (
    <div className="bg-gray-900 border rounded-lg p-4 flex flex-col gap-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold leading-none">{value}</p>
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
      />
      <StatCard
        label="Total Feedbacks"
        value={totalFeedbacks.toString()}
        subLabel="Submitted by customers"
      />
      <StatCard
        label="Positive Feedback"
        value={positiveFeedbackCount.toString()}
        subLabel={`${positiveRate} rated 4 stars or above`}
      />
      <StatCard
        label="Needs Attention"
        value={lowRatingCount.toString()}
        subLabel="Rated 2 stars or below"
      />
    </div>
  );
};

export default FeedbackOverview;
