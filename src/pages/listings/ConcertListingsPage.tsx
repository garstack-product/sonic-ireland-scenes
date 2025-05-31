
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import { fetchTicketmasterEvents } from "@/services/api";
import EventFilters from "@/components/events/filters/EventFilters";
import EventListingsStatus from "@/components/events/EventListingsStatus";
import { useEventFiltering } from "@/hooks/useEventFiltering";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

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
        
        // Filter for Ireland events only and future events only
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today
        
        const irelandFutureConcerts = events.filter(event => {
          // Check if event is in Ireland
          const isIreland = event.country === 'Ireland' || 
                           event.venue?.toLowerCase().includes('dublin') ||
                           event.venue?.toLowerCase().includes('cork') ||
                           event.venue?.toLowerCase().includes('galway') ||
                           event.venue?.toLowerCase().includes('belfast') ||
                           event.venue?.toLowerCase().includes('limerick') ||
                           event.venue?.toLowerCase().includes('waterford') ||
                           event.venue?.toLowerCase().includes('kilkenny') ||
                           event.venue?.toLowerCase().includes('derry') ||
                           event.venue?.toLowerCase().includes('ireland');
          
          // Check if event is in the future
          let isFuture = false;
          if (event.rawDate) {
            const eventDate = new Date(event.rawDate);
            isFuture = eventDate >= today;
          } else if (event.date) {
            // Try to parse the formatted date as fallback
            const eventDate = new Date(event.date);
            isFuture = !isNaN(eventDate.getTime()) && eventDate >= today;
          }
          
          return isIreland && isFuture;
        });
        
        // Sort events by date (earliest first)
        const sortedEvents = sortEventsByDate(irelandFutureConcerts);
        setConcertListings(sortedEvents);
        console.log(`Loaded ${sortedEvents.length} future concerts in Ireland`);
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
      const dateA = new Date(a.rawDate || a.date);
      const dateB = new Date(b.rawDate || b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  // Group displayed events by month for dividers
  const groupedByMonth = displayedListings.reduce((groups, event) => {
    const eventDate = new Date(event.rawDate || event.date);
    const monthYear = format(eventDate, 'MMMM yyyy');
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {} as Record<string, EventCardProps[]>);

  return (
    <div>
      <PageHeader 
        title="Concert Listings" 
        subtitle="Discover upcoming concerts in Ireland"
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
          {isLoading ? "Loading concerts..." : `${filteredListings.length} upcoming concerts found in Ireland`}
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : displayedListings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No upcoming concerts found in Ireland matching your filters. Try adjusting your search.
        </div>
      ) : (
        <>
          {Object.entries(groupedByMonth).map(([monthYear, events], monthIndex) => (
            <div key={monthYear}>
              {monthIndex > 0 && (
                <div className="my-8 flex items-center">
                  <Separator className="flex-1" />
                  <div className="mx-4 text-sm text-gray-400 font-medium">
                    {monthYear}
                  </div>
                  <Separator className="flex-1" />
                </div>
              )}
              
              {monthIndex === 0 && (
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-medium text-gray-300">{monthYear}</h3>
                </div>
              )}
              
              <EventGrid 
                events={events} 
                emptyMessage=""
              />
            </div>
          ))}
          
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
