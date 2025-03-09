
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface DateRangeSelectorProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  setDateRange: Dispatch<SetStateAction<{
    from: Date;
    to: Date;
  }>>;
}

export function DateRangeSelector({
  dateRange,
  setDateRange,
}: DateRangeSelectorProps) {
  const handleRangeSelect = (range: "day" | "week" | "month" | "year") => {
    const now = new Date();
    let from = new Date();
    
    switch (range) {
      case "day":
        from = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        from = new Date(now.setDate(now.getDate() - now.getDay()));
        break;
      case "month":
        from = new Date(now.setDate(1));
        break;
      case "year":
        from = new Date(now.setMonth(0, 1));
        break;
    }
    
    setDateRange({
      from,
      to: new Date(),
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dateRange.from, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <span>to</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dateRange.to, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRangeSelect("day")}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRangeSelect("week")}
        >
          This Week
        </Button>
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
          onClick={() => handleRangeSelect("year")}
        >
          This Year
        </Button>
      </div>
    </div>
  );
}
