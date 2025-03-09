
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
  dateRange: DateRangeProps;
  setDateRange: React.Dispatch<React.SetStateAction<DateRangeProps>>;
  onRangeSelect?: (range: "day" | "week" | "month" | "year") => void;
}

export function DateRangeSelector({ 
  dateRange, 
  setDateRange, 
  onRangeSelect 
}: DateRangeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal h-9"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDateRange({ from: range.from, to: range.to });
              }
            }}
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
