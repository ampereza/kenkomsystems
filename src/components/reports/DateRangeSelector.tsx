
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export interface DateRangeProps {
  from: Date;
  to: Date;
}

interface DateRangeSelectorProps {
  dateRange: DateRangeProps;
  onDateRangeChange: (range: DateRangeProps) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const handleFromChange = (date: Date | undefined) => {
    if (date) {
      onDateRangeChange({ from: date, to: dateRange.to });
    }
  };

  const handleToChange = (date: Date | undefined) => {
    if (date) {
      onDateRangeChange({ from: dateRange.from, to: date });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">From</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-[200px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? format(dateRange.from, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={handleFromChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">To</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-[200px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.to ? format(dateRange.to, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={handleToChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeSelector;
