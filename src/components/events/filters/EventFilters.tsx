
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  dateRange,
  setDateRange,
  showDatePicker,
  setShowDatePicker,
}: EventFiltersProps) => {
  // Ultra-robust genre validation with logging
  const validGenres = genres.filter(genre => {
    const isValid = genre && 
                   typeof genre === 'string' && 
                   genre.trim().length > 0 &&
                   genre.trim() !== "" &&
                   genre !== null &&
                   genre !== undefined;
    
    if (!isValid) {
      console.log(`EventFilters: Filtering out invalid genre:`, genre);
    }
    
    return isValid;
  });

  console.log("EventFilters: Valid genres for Select:", validGenres);

  return (
    <div className="space-y-6">
      {/* Search, Genre, and Date Range in one row */}
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
            {validGenres.length > 0 ? (
              validGenres.map(genre => {
                console.log(`Rendering SelectItem for genre: "${genre}"`);
                return (
                  <SelectItem key={genre} value={genre} className="hover:bg-dark-100">
                    {genre}
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem key="fallback-all-genres" value="All Genres" className="hover:bg-dark-100">
                All Genres
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        
        {/* Date Range Filter */}
        <DateRangeFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />
      </div>
    </div>
  );
};

export default EventFilters;
