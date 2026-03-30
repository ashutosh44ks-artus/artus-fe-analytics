import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerFeedbackDataSuccessResponse } from "@/services/customer-feedback";
import { formatDistance } from "date-fns";
import { ClockIcon } from "lucide-react";
import { useMemo } from "react";
import { PiCopySimple } from "react-icons/pi";
import { toast } from "sonner";
import { HEAR_ABOUT_OPTIONS, JOB_TITLE_OPTIONS } from "./utils";

interface FeedbackItemProps extends Omit<
  CustomerFeedbackDataSuccessResponse["feedback"][number],
  "created_at"
> {
  timeDistance: string;
}
const FeedbackItem = ({ timeDistance, ...feedback }: FeedbackItemProps) => {
  const {
    email,
    feedback: feedbackContent,
    rating,
    company_name,
    heard_from,
    job_title,
  } = feedback;
  const handleCopyEmail = () => {
    try {
      navigator.clipboard.writeText(email);
      toast.success("Email copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy email to clipboard:", err);
      toast.error("Failed to copy email. Please try again.");
    }
  };
  const formattedCustomerMetaData = useMemo(() => {
    const result = {
      company_name,
      heard_from,
      job_title,
    };
    const jobTitleLabel = JOB_TITLE_OPTIONS.find(
      (option) => option.value === job_title,
    )?.label;
    const heardFromLabel = HEAR_ABOUT_OPTIONS.find(
      (option) => option.value === heard_from,
    )?.label;
    if (jobTitleLabel) {
      result.job_title = jobTitleLabel;
    }
    if (heardFromLabel) {
      result.heard_from = heardFromLabel;
    }
    return result;
  }, [job_title, company_name, heard_from]);
  return (
    <div className="bg-gray-900 border rounded-lg p-4 flex flex-col gap-4 group">
      <div className="flex justify-between items-center">
        <p className="text-xs flex items-center gap-1">
          <span className="text-muted-foreground">RATING:</span>
          <span className="font-medium">{rating} / 5</span>
        </p>
        <Badge variant="outline">
          <ClockIcon />
          <span className="opacity-75">{timeDistance}</span>
        </Badge>
      </div>
      <h3 className="text-sm">{feedbackContent}</h3>
      <div className="flex justify-between items-center sm:flex-nowrap flex-wrap gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">From:</span>
          <span
            className="flex items-center gap-2 cursor-pointer opacity-90"
            onClick={handleCopyEmail}
          >
            <span className="text-sm">{email}</span>
            <PiCopySimple className="size-4" />
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Job Title:</span>
          <span className="text-sm opacity-90">
            {formattedCustomerMetaData.job_title} at{" "}
            {formattedCustomerMetaData.company_name}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Heard From:</span>
          <span className="text-sm opacity-90">
            {formattedCustomerMetaData.heard_from}
          </span>
        </div>
      </div>
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
