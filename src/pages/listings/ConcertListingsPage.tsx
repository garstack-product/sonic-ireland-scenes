
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import { fetchTicketmasterEvents } from "@/services/api";
import EventFilters from "@/components/events/filters/EventFilters";
import EventListingsStatus from "@/components/events/EventListingsStatus";
import { useEventFiltering } from "@/hooks/useEventFiltering";

const ConcertListingsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [concertListings, setConcertListings] = useState<EventCardProps[]>([]);
  
  // Use the filtering hook that includes all the filtering logic
  const {
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
    filteredEvents: filteredListings,
    displayedEvents: displayedListings,
    handleLoadMore
  } = useEventFiltering({ events: concertListings });
  
  useEffect(() => {
    const loadConcerts = async () => {
      try {
        setIsLoading(true);
        const events = await fetchTicketmasterEvents();
        
        // Sort events by date (most recent first)
        const sortedEvents = sortEventsByDate(events);
        setConcertListings(sortedEvents);
        console.log(`Loaded ${sortedEvents.length} concerts`);
      } catch (error) {
        console.error("Error loading concert data:", error);
        toast.error("Failed to load concert data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConcerts();
  }, []);
  
  // Helper function to sort events by date
  const sortEventsByDate = (events: EventCardProps[]) => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  return (
    <div>
      <PageHeader 
        title="Concert Listings" 
        subtitle="Discover upcoming concerts in Ireland from Ticketmaster and Eventbrite"
      />
      
      <EventFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        genres={genres}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />
      
      <div className="mb-6 mt-4">
        <p className="text-gray-400">
          {isLoading ? "Loading concerts..." : `${filteredListings.length} concerts found`}
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <EventGrid 
            events={displayedListings} 
            emptyMessage="No concerts found matching your filters. Try adjusting your search."
          />
          
          <EventListingsStatus
            isLoading={isLoading}
            displayedListings={displayedListings}
            filteredListings={filteredListings}
            onLoadMore={handleLoadMore}
          />
        </>
      )}
    </div>
  );
};

export default ConcertListingsPage;
