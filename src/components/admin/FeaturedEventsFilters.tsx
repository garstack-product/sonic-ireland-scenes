
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown } from "lucide-react";

interface FeaturedEventsFiltersProps {
  searchTerm: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const FeaturedEventsFilters = ({
  searchTerm,
  sortBy,
  onSearchChange,
  onSortChange
}: FeaturedEventsFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search events..."
          className="pl-10 bg-dark-200 border-gray-700 text-white"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-gray-400" />
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48 bg-dark-200 border-gray-700 text-white">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-gray-700">
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="featured">Featured First</SelectItem>
            <SelectItem value="festival">Festivals First</SelectItem>
            <SelectItem value="visibility">Visible First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FeaturedEventsFilters;
