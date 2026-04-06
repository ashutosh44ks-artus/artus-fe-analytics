import { CustomerFeedbackDataSuccessResponse } from "@/services/customer-feedback";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  MessageSquareText,
  Star,
  TrendingUp,
} from "lucide-react";
import StatCard from "@/app/dashboard/components/StatCard";

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
