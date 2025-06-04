
import { useState, useEffect } from "react";
import { EventCardProps } from "@/components/ui/EventCard";

interface UseEventFilteringProps {
  events: EventCardProps[];
  initialVisibleCount?: number;
}

export const useEventFiltering = ({ events, initialVisibleCount = 80 }: UseEventFilteringProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [genres, setGenres] = useState<string[]>(["All Genres"]);
  const [dateRange, setDateRange] = useState<{from: Date | undefined; to: Date | undefined}>({
    from: undefined,
    to: undefined,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<EventCardProps[]>([]);
  const [visibleItemCount, setVisibleItemCount] = useState(initialVisibleCount);
  const [displayedEvents, setDisplayedEvents] = useState<EventCardProps[]>([]);

  // Extract genres from events with ultra-robust filtering
  useEffect(() => {
    console.log("Processing events for genres:", events.length);
    const allGenres = new Set<string>();
    allGenres.add("All Genres");
    
    events.forEach((event, index) => {
      console.log(`Event ${index} genre:`, event.genre, typeof event.genre);
      
      // Ultra-strict validation for genres
      if (event.genre && 
          typeof event.genre === 'string' && 
          event.genre.trim().length > 0 && 
          event.genre.trim() !== "Undefined" &&
          event.genre.trim() !== "undefined" &&
          event.genre.trim() !== "null" &&
          event.genre.trim() !== "NULL" &&
          event.genre !== null &&
          event.genre !== undefined) {
        
        const cleanGenre = event.genre.trim();
        console.log(`Adding valid genre: "${cleanGenre}"`);
        allGenres.add(cleanGenre);
      } else {
        console.log(`Skipping invalid genre:`, event.genre);
      }
    });
    
    // Convert to array with final validation
    const genreArray = Array.from(allGenres).filter(genre => {
      const isValid = genre && 
                     typeof genre === 'string' && 
                     genre.trim().length > 0 &&
                     genre.trim() !== "";
      
      if (!isValid) {
        console.log(`Filtering out invalid genre in final step:`, genre);
      }
      return isValid;
    });
    
    console.log("Final genre array:", genreArray);
    setGenres(genreArray);
  }, [events]);

  // Filter events based on criteria (removed price filtering)
  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch = 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = selectedGenre === "All Genres" || event.genre === selectedGenre;
      
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
      
      return matchesSearch && matchesGenre && matchesDateRange;
    });
    
    setFilteredEvents(filtered);
    setVisibleItemCount(initialVisibleCount);
  }, [events, searchTerm, selectedGenre, dateRange, initialVisibleCount]);
  
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
