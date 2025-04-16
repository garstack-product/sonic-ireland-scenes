
import { useState, useEffect } from "react";
import { EventCardProps } from "@/components/ui/EventCard";

interface UseEventFilteringProps {
  events: EventCardProps[];
  initialVisibleCount?: number;
}

export const useEventFiltering = ({ events, initialVisibleCount = 80 }: UseEventFilteringProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [genres, setGenres] = useState<string[]>(["All Genres"]);
  const [dateRange, setDateRange] = useState<{from: Date | undefined; to: Date | undefined}>({
    from: undefined,
    to: undefined,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<EventCardProps[]>([]);
  const [visibleItemCount, setVisibleItemCount] = useState(initialVisibleCount);
  const [displayedEvents, setDisplayedEvents] = useState<EventCardProps[]>([]);

  // Extract genres from events
  useEffect(() => {
    const allGenres = new Set<string>();
    allGenres.add("All Genres");
    
    events.forEach(event => {
      if (event.genre && event.genre !== "Undefined") {
        allGenres.add(event.genre);
      }
    });
    
    setGenres(Array.from(allGenres));
  }, [events]);

  // Filter events based on criteria
  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch = 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = selectedGenre === "All Genres" || event.genre === selectedGenre;
      
      // Price filtering logic
      const matchesPrice = 
        !event.price || 
        (event.price >= priceRange[0] && 
         (event.maxPrice ? event.maxPrice <= priceRange[1] : event.price <= priceRange[1]));
      
      // Date range filtering
      let matchesDateRange = true;
      if (dateRange.from || dateRange.to) {
        const eventDate = new Date(event.date);
        
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
    
    setFilteredEvents(filtered);
    setVisibleItemCount(initialVisibleCount);
  }, [events, searchTerm, selectedGenre, priceRange, dateRange, initialVisibleCount]);
  
  // Update displayed events based on visible count
  useEffect(() => {
    setDisplayedEvents(filteredEvents.slice(0, visibleItemCount));
  }, [filteredEvents, visibleItemCount]);
  
  const handleLoadMore = () => {
    setVisibleItemCount(prevCount => prevCount + initialVisibleCount);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    priceRange,
    setPriceRange,
    genres,
    dateRange,
    setDateRange,
    showDatePicker,
    setShowDatePicker,
    filteredEvents,
    displayedEvents,
    visibleItemCount,
    handleLoadMore
  };
};
