import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const EmptyState = ({ message }: { message: string }) => (
  <div className="flex h-55 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/40 text-sm text-slate-400">
    {message}
  </div>
);

interface TrendCardProps {
  title: string;
  description: string;
  badgeText?: string | null;
  latestValue?: string | number | null;
  children?: React.ReactNode;
}
const TrendCard = ({
  title,
  description,
  badgeText,
  latestValue,
  children,
}: TrendCardProps) => {
  return (
    <Card className="border-slate-800 bg-gray-900 text-slate-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-1 text-xs text-slate-400">
              {description}
            </CardDescription>
          </div>
          {badgeText ? (
            <Badge
              variant="outline"
              className="border-slate-700 text-[11px] text-slate-200"
            >
              {badgeText}
            </Badge>
          ) : null}
        </div>
        {latestValue !== null && (
          <p className="text-2xl font-semibold text-slate-50">{latestValue}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default TrendCard;
