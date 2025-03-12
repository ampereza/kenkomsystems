
import React from "react";
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

export interface DateRangeSelectorProps {
  // New API - preferred
  dateRange?: DateRangeProps;
  setDateRange?: React.Dispatch<React.SetStateAction<DateRangeProps>>;
  
  // Legacy API - for backward compatibility
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: React.Dispatch<React.SetStateAction<Date>>;
  onEndDateChange?: React.Dispatch<React.SetStateAction<Date>>;
  
  // Common props
  onRangeSelect?: (range: "day" | "week" | "month" | "year") => void;
}

export function DateRangeSelector({ 
  dateRange,
  setDateRange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRangeSelect 
}: DateRangeSelectorProps) {
  // Use either the new API or the legacy API
  const from = dateRange?.from || startDate || new Date();
  const to = dateRange?.to || endDate || new Date();
  
  // Handle date selection based on which API is being used
  const handleDateSelection = (range: { from?: Date; to?: Date }) => {
    if (range?.from && range?.to) {
      if (setDateRange) {
        // New API
        setDateRange({ from: range.from, to: range.to });
      } else if (onStartDateChange && onEndDateChange) {
        // Legacy API
        onStartDateChange(range.from);
        onEndDateChange(range.to);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal h-9"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(from, "PPP")} - {format(to, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={{
              from: from,
              to: to,
            }}
            onSelect={handleDateSelection}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      
      {onRangeSelect && (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRangeSelect("day")}
            className="h-9"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRangeSelect("week")}
            className="h-9"
          >
            This Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRangeSelect("month")}
            className="h-9"
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRangeSelect("year")}
            className="h-9"
          >
            This Year
          </Button>
        </div>
      )}
    </div>
  );
}
