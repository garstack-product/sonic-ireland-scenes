
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

interface DateRangeFilterProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: (range: {from: Date | undefined; to: Date | undefined}) => void;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
}

const DateRangeFilter = ({
  dateRange,
  setDateRange,
  showDatePicker,
  setShowDatePicker,
}: DateRangeFilterProps) => {
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'PP')} - ${format(dateRange.to, 'PP')}`;
    } else if (dateRange.from) {
      return `From ${format(dateRange.from, 'PP')}`;
    } else if (dateRange.to) {
      return `Until ${format(dateRange.to, 'PP')}`;
    }
    return "Date Range";
  };

  return (
    <div className="flex justify-end">
      <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <CalendarIcon size={16} />
            <span>{formatDateRange()}</span>
            <ChevronDown size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-dark-200 border-gray-700" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="bg-dark-200 text-white"
          />
          <div className="p-3 border-t border-gray-700 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setDateRange({ from: undefined, to: undefined });
                setShowDatePicker(false);
              }}
            >
              Clear
            </Button>
            <Button 
              size="sm"
              onClick={() => setShowDatePicker(false)}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeFilter;
