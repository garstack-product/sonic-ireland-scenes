
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import DateRangeFilter from "./DateRangeFilter";

interface EventFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedGenre: string;
  setSelectedGenre: (value: string) => void;
  genres: string[];
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  dateRange: {from: Date | undefined; to: Date | undefined};
  setDateRange: (range: {from: Date | undefined; to: Date | undefined}) => void;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
}

const EventFilters = ({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  genres,
  priceRange,
  setPriceRange,
  dateRange,
  setDateRange,
  showDatePicker,
  setShowDatePicker,
}: EventFiltersProps) => {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by name, artist or location..."
            className="pl-10 bg-dark-300 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Genre Select */}
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="bg-dark-300 border-gray-700 text-white">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-gray-700 text-white">
            {genres.map(genre => (
              <SelectItem key={genre} value={genre} className="hover:bg-dark-100">
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Price Range Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Price Range: €{priceRange[0]} - €{priceRange[1]}</span>
          </div>
          <Slider
            defaultValue={[0, 500]}
            min={0}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="py-2"
          />
        </div>
      </div>
      
      {/* Date Range Filter */}
      <DateRangeFilter
        dateRange={dateRange}
        setDateRange={setDateRange}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />
    </div>
  );
};

export default EventFilters;
