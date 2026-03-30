import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CustomerFeedbackDataSuccessResponse } from "@/services/customer-feedback";
import { formatDistance } from "date-fns";
import {
  BriefcaseBusiness,
  ClockIcon,
  Mail,
  MessageSquareQuote,
  Star,
  UserRoundSearch,
} from "lucide-react";
import { useMemo } from "react";
import { PiCopySimple } from "react-icons/pi";
import { toast } from "sonner";
import { getRatingTone, HEAR_ABOUT_OPTIONS, JOB_TITLE_OPTIONS } from "./utils";

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
  const ratingTone = getRatingTone(rating);

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
    <div
      className={cn(
        "bg-gray-900 border rounded-lg p-4 sm:p-5 flex flex-col gap-4 group relative overflow-hidden",
        "before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-linear-to-b",
        ratingTone.cardAccent,
      )}
    >
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge className={cn("border", ratingTone.badge)}>
            <Star className={cn("size-3.5", ratingTone.icon)} />
            <span>
              {rating} / 5 • {ratingTone.label}
            </span>
          </Badge>
        </div>
        <Badge variant="outline">
          <ClockIcon />
          <span className="opacity-75">{timeDistance}</span>
        </Badge>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/25 p-3 sm:p-4">
        <p className="text-sm leading-relaxed flex items-center gap-2">
          <MessageSquareQuote className="size-4 shrink-0 text-muted-foreground" />
          <span>{feedbackContent}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="rounded-md border border-border/60 px-3 py-2 bg-background/20">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Mail className="size-3.5" />
            From
          </span>
          <button
            type="button"
            className="mt-1 flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
            onClick={handleCopyEmail}
          >
            <span className="text-sm truncate max-w-55 text-left">{email}</span>
            <PiCopySimple className="size-4 shrink-0" />
          </button>
        </div>

        <div className="rounded-md border border-border/60 px-3 py-2 bg-background/20">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <BriefcaseBusiness className="size-3.5" />
            Job Title & Company
          </span>
          <span className="mt-1 text-sm opacity-90 flex items-center gap-1.5">
            {formattedCustomerMetaData.job_title} at {formattedCustomerMetaData.company_name}
          </span>
        </div>

        <div className="rounded-md border border-border/60 px-3 py-2 bg-background/20">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <UserRoundSearch className="size-3.5" />
            Heard From
          </span>
          <span className="mt-1 text-sm opacity-90">{formattedCustomerMetaData.heard_from}</span>
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
