
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onRangeSelect: (range: "day" | "week" | "month" | "year") => void;
}

export function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRangeSelect,
}: DateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(startDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && onStartDateChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <span>to</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(endDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => date && onEndDateChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRangeSelect("day")}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRangeSelect("week")}
        >
          This Week
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRangeSelect("month")}
        >
          This Month
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRangeSelect("year")}
        >
          This Year
        </Button>
      </div>
    </div>
  );
}
