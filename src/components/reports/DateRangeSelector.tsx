
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export interface DateRangeProps {
  from: Date;
  to: Date;
}

export interface DateRangeSelectorProps {
  dateRange: { from: Date; to: Date };
  setDateRange?: React.Dispatch<React.SetStateAction<{ from: Date; to: Date }>>;
  selectedRange?: string;
  setSelectedRange?: React.Dispatch<React.SetStateAction<string>>;
  onRangeSelect?: (range: 'day' | 'week' | 'month' | 'year') => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  setDateRange,
  selectedRange,
  setSelectedRange,
  onRangeSelect
}) => {
  // Component implementation
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 items-center">
          <div className="space-x-2 flex">
            <Button 
              variant={selectedRange === 'day' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => onRangeSelect && onRangeSelect('day')}
            >
              Day
            </Button>
            <Button 
              variant={selectedRange === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => onRangeSelect && onRangeSelect('week')}
            >
              Week
            </Button>
            <Button 
              variant={selectedRange === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => onRangeSelect && onRangeSelect('month')}
            >
              Month
            </Button>
            <Button 
              variant={selectedRange === 'year' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => onRangeSelect && onRangeSelect('year')}
            >
              Year
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8 hidden sm:block" />
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal w-[240px]",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={{ 
                    from: dateRange.from, 
                    to: dateRange.to 
                  }}
                  onSelect={(range) => {
                    if (range && setDateRange) {
                      setDateRange({ 
                        from: range.from || new Date(), 
                        to: range.to || new Date() 
                      });
                    }
                    if (setSelectedRange) {
                      setSelectedRange('custom');
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
