
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export interface DateRangeProps {
  from: Date;
  to: Date;
}

interface DateRangeSelectorProps {
  dateRange?: DateRangeProps;
  onDateRangeChange?: (range: DateRangeProps) => void;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: (date: Date) => void;
  onEndDateChange?: (date: Date) => void;
  onRangeSelect?: (range: "day" | "week" | "month" | "year" | string) => void;
}

export function DateRangeSelector({
  dateRange,
  onDateRangeChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRangeSelect,
}: DateRangeSelectorProps) {
  const [localDateRange, setLocalDateRange] = useState<DateRangeProps>({
    from: dateRange?.from || startDate || new Date(),
    to: dateRange?.to || endDate || new Date(),
  });

  useEffect(() => {
    if (dateRange) {
      setLocalDateRange(dateRange);
    } else if (startDate && endDate) {
      setLocalDateRange({ from: startDate, to: endDate });
    }
  }, [dateRange, startDate, endDate]);

  const handleDateChange = (date: Date | undefined, type: "from" | "to") => {
    if (!date) return;

    const newRange = {
      ...localDateRange,
      [type]: date,
    };

    setLocalDateRange(newRange);

    if (onDateRangeChange) {
      onDateRangeChange(newRange);
    } else {
      if (type === "from" && onStartDateChange) {
        onStartDateChange(date);
      } else if (type === "to" && onEndDateChange) {
        onEndDateChange(date);
      }
    }
  };

  const handleRangeSelect = (range: "day" | "week" | "month" | "year" | string) => {
    if (onRangeSelect) {
      onRangeSelect(range);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(localDateRange.from, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localDateRange.from}
                onSelect={(date) => handleDateChange(date, "from")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(localDateRange.to, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localDateRange.to}
                onSelect={(date) => handleDateChange(date, "to")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {onRangeSelect && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRangeSelect("month")}
            >
              This Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRangeSelect("quarter")}
            >
              This Quarter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRangeSelect("year")}
            >
              This Year
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
