
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { fetchPresaleEvents } from "@/services/api/events/presaleService";
import { useEventFiltering } from "@/hooks/useEventFiltering";
import EventFilters from "@/components/events/filters/EventFilters";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PresalesPage = () => {
  const [visibleItemCount, setVisibleItemCount] = useState(40);
  
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['presale-events'],
    queryFn: fetchPresaleEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
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
    handleLoadMore
  } = useEventFiltering({ events, initialVisibleCount: visibleItemCount });

  const formatPresaleDate = (dateString: string | null | undefined) => {
    if (!dateString) return "TBA";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IE', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "TBA";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Pre Sales"
          subtitle="Music events in Ireland with upcoming presale dates"
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400">Loading presale events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Pre Sales"
          subtitle="Music events in Ireland with upcoming presale dates"
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-400">Error loading presale events</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Pre Sales"
        subtitle={`${events.length} music events in Ireland with upcoming presale dates`}
      />
      
      <EventFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        genres={genres}
        priceRange={[0, 1000]}
        setPriceRange={() => {}}
        dateRange={dateRange}
        setDateRange={setDateRange}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />

      {events.length > 0 && (
        <div className="mb-6">
          <div className="bg-dark-300 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Upcoming Presale Dates</h3>
            <Carousel className="w-full">
              <CarouselContent>
                {displayedEvents.map((event) => (
                  <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="bg-dark-400 border border-gray-600 rounded p-3">
                      <h4 className="font-medium text-white text-sm mb-1 line-clamp-1">{event.title}</h4>
                      <p className="text-gray-300 text-xs mb-1">{event.artist}</p>
                      <p className="text-gray-400 text-xs mb-2">{event.venue}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Presale:</span>
                        <span className="text-xs text-green-400 font-medium">
                          {formatPresaleDate(event.onSaleDate)}
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:flex justify-end mt-4">
                <CarouselPrevious className="relative inset-0 translate-y-0 left-0 mr-2" />
                <CarouselNext className="relative inset-0 translate-y-0 right-0" />
              </div>
            </Carousel>
          </div>
        </div>
      )}
      
      <EventGrid 
        events={displayedEvents}
        emptyMessage="No presale events found. Check back soon for new announcements!"
      />
      
      {filteredEvents.length > displayedEvents.length && (
        <div className="text-center mt-8">
          <Button 
            onClick={handleLoadMore}
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
};

export default PresalesPage;
