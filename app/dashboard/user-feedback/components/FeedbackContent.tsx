import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerFeedbackDataSuccessResponse } from "@/services/customer-feedback";
import { formatDistance } from "date-fns";
import { ClockIcon } from "lucide-react";
import { PiCopySimple } from "react-icons/pi";
import { toast } from "sonner";

interface FeedbackItemProps extends Omit<
  CustomerFeedbackDataSuccessResponse["feedback"][number],
  "created_at"
> {
  timeDistance: string;
}
const FeedbackItem = ({ timeDistance, ...feedback }: FeedbackItemProps) => {
  const { email, feedback: feedbackContent, rating } = feedback;
  const handleCopyEmail = () => {
    try {
      navigator.clipboard.writeText(email);
      toast.success("Email copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy email to clipboard:", err);
      toast.error("Failed to copy email. Please try again.");
    }
  };
  return (
    <div className="bg-gray-900 border rounded-lg p-4 flex flex-col gap-4 group">
      <div className="flex justify-between items-center">
        <Badge variant="outline">
          <ClockIcon />
          <span className="opacity-75">{timeDistance}</span>
        </Badge>
        <span
          className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-white transition-colors duration-150 ease-in-out"
          onClick={handleCopyEmail}
        >
          <PiCopySimple className="size-4" />
          <span className="text-sm">{email}</span>
        </span>
      </div>
      <h3 className="text-sm">{feedbackContent}</h3>
      <p className="text-xs">
        Rating: <span>{rating} / 5</span>
      </p>
    </div>
  );
};

interface FeedbackContentProps {
  data: CustomerFeedbackDataSuccessResponse["feedback"] | undefined;
  isLoading: boolean;
  error: unknown;
}
const FeedbackContent = ({ data, isLoading, error }: FeedbackContentProps) => {
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-26 w-full rounded-lg mb-4" />
        ))}
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="text-red-400">
        Error loading data. Please try again later.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {data.map((feedback) => {
        return (
          <FeedbackItem
            key={feedback.feedback_id}
            {...feedback}
            timeDistance={formatDistance(
              new Date(feedback.created_at + "Z"),
              new Date(),
              {
                addSuffix: true,
              },
            )}
          />
        );
      })}
    </div>
  );
};

export default FeedbackContent;
