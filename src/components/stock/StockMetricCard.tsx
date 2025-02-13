
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StockMetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  className?: string;
}

export function StockMetricCard({ title, value, change, className }: StockMetricCardProps) {
  return (
    <div className={cn("stock-card", className)}>
      <h3 className="stat-label">{title}</h3>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="stat-value">{value}</p>
        {change && (
          <div
            className={cn(
              "stat-change flex items-center gap-1",
              change.type === "increase" ? "positive" : "negative"
            )}
          >
            {change.type === "increase" ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : (
              <ArrowDownIcon className="h-3 w-3" />
            )}
            {Math.abs(change.value)}%
          </div>
        )}
      </div>
    </div>
  );
}
