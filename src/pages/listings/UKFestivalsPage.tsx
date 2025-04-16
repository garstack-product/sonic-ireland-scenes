
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Calendar, ChevronDown, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCardProps } from "@/components/ui/EventCard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UKFestivalsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [isLoading, setIsLoading] = useState(true);
  const [festivals, setFestivals] = useState<EventCardProps[]>([]);
  const [filteredListings, setFilteredListings] = useState<EventCardProps[]>([]);
  const [displayedListings, setDisplayedListings] = useState<EventCardProps[]>([]);
  const [genres, setGenres] = useState<string[]>(["All Genres"]);
  const [dateRange, setDateRange] = useState<{from: Date | undefined; to: Date | undefined}>({
    from: undefined,
    to: undefined,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [visibleItemCount, setVisibleItemCount] = useState(80);

  useEffect(() => {
    const loadFestivals = async () => {
      try {
        setIsLoading(true);
        
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .eq('country', 'UK')
          .eq('is_festival', true)
          .order('raw_date', { ascending: true });

        if (error) throw error;

        const allGenres = new Set<string>();
        allGenres.add("All Genres");

        // Map the database fields to EventCardProps format
        const mappedEvents: EventCardProps[] = (events || []).map(event => {
          if (event.genre && event.genre !== "Undefined") {
            allGenres.add(event.genre);
          }

          // Extract min and max price from event.raw_data if available
          let price = event.price;
          let maxPrice = undefined;
          
          if (event.raw_data?.priceRanges && event.raw_data.priceRanges.length > 0) {
            price = event.raw_data.priceRanges[0].min;
            maxPrice = event.raw_data.priceRanges[0].max;
            
            // Only set maxPrice if it's different from price
            if (maxPrice <= price) {
              maxPrice = undefined;
            }
          }

          return {
            id: event.id,
            title: event.title,
            artist: event.artist || '',
            venue: event.venue || '',
            date: event.date || '',
            time: event.time || '',
            imageUrl: event.image_url || '/placeholder.svg',
            type: (event.type as 'concert' | 'festival') || 'festival',
            category: 'listing' as const,
            genre: event.genre || undefined,
            subgenre: event.subgenre || undefined,
            price: price || undefined,
            maxPrice: maxPrice,
            ticketUrl: event.ticket_url || undefined,
            rawDate: event.raw_date || undefined,
            onSaleDate: event.on_sale_date || null,
            source: 'database',
            venue_id: event.venue_id || undefined,
            is_featured: event.is_featured,
            is_hidden: event.is_hidden,
            rawData: event.raw_data
          };
        });

        setFestivals(mappedEvents);
        setGenres(Array.from(allGenres));
      } catch (error) {
        console.error("Error loading UK festivals:", error);
        toast.error("Failed to load UK festivals");
      } finally {
        setIsLoading(false);
      }
    };

    loadFestivals();
  }, []);

  useEffect(() => {
    const filtered = festivals.filter(listing => {
      const matchesSearch = 
        listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.venue?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = selectedGenre === "All Genres" || listing.genre === selectedGenre;
      
      // Updated price filtering logic to handle price ranges
      const matchesPrice = 
        !listing.price || 
        (listing.price >= priceRange[0] && 
         (listing.maxPrice ? listing.maxPrice <= priceRange[1] : listing.price <= priceRange[1]));
      
      let matchesDateRange = true;
      if (dateRange.from || dateRange.to) {
        const eventDate = new Date(listing.date);
        
        if (dateRange.from && dateRange.to) {
          matchesDateRange = eventDate >= dateRange.from && eventDate <= dateRange.to;
        } else if (dateRange.from) {
          matchesDateRange = eventDate >= dateRange.from;
        } else if (dateRange.to) {
          matchesDateRange = eventDate <= dateRange.to;
        }
      }
      
      return matchesSearch && matchesGenre && matchesPrice && matchesDateRange;
    });
    
    setFilteredListings(filtered);
    setVisibleItemCount(80);
  }, [festivals, searchTerm, selectedGenre, priceRange, dateRange]);
  
  useEffect(() => {
    setDisplayedListings(filteredListings.slice(0, visibleItemCount));
  }, [filteredListings, visibleItemCount]);
  
  const handleLoadMore = () => {
    setVisibleItemCount(prevCount => prevCount + 80);
  };
  
  const handleDateRangeChange = (range: {from: Date | undefined; to: Date | undefined}) => {
    setDateRange(range);
  };

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
    <div>
      <PageHeader 
        title="UK Festivals" 
        subtitle="Discover upcoming festivals in the United Kingdom"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-400">
          {isLoading ? "Loading festivals..." : `${filteredListings.length} festivals found`}
        </p>
        
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar size={16} />
              <span>{formatDateRange()}</span>
              <ChevronDown size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-dark-200 border-gray-700" align="end">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{
                from: dateRange.from,
                to: dateRange.to,
              }}
              onSelect={handleDateRangeChange}
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
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <EventGrid 
            events={displayedListings} 
            emptyMessage="No festivals found matching your filters."
          />
          
          {displayedListings.length < filteredListings.length && (
            <div className="mt-8 flex justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleLoadMore}
                className="flex items-center gap-2"
              >
                View More <ChevronDown size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UKFestivalsPage;
