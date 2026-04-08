import { cn } from "@/lib/utils";
import { LucideIcon, Minus, TrendingDown, TrendingUp } from "lucide-react";

export type StatCardTrendDirection = "up" | "down" | "flat";

const StatCard = ({
  label,
  value,
  subLabel,
  Icon,
  tone,
  trendDirection,
}: {
  label: string;
  value: string;
  subLabel?: string;
  Icon: LucideIcon;
  tone: "amber" | "blue" | "emerald" | "rose";
  trendDirection?: StatCardTrendDirection;
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

  const trendIcon =
    trendDirection === "up" ? (
      <TrendingUp className="size-4" />
    ) : trendDirection === "down" ? (
      <TrendingDown className="size-4" />
    ) : trendDirection === "flat" ? (
      <Minus className="size-4" />
    ) : null;

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
      <div className="flex items-center gap-2">
        <p className={cn("text-2xl font-semibold leading-none", selectedTone.value)}>
          {value}
        </p>
        {trendIcon ? (
          <span
            className={cn(
              "inline-flex items-center",
              trendDirection === "up"
                ? "text-emerald-300"
                : trendDirection === "down"
                  ? "text-rose-300"
                  : "text-muted-foreground",
            )}
            aria-hidden="true"
          >
            {trendIcon}
          </span>
        ) : null}
      </div>
      {subLabel ? <p className="text-xs text-muted-foreground">{subLabel}</p> : null}
    </div>
  );
};

export default StatCard;