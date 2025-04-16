
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import EventFilters from "@/components/events/filters/EventFilters";
import EventListingsStatus from "@/components/events/EventListingsStatus";
import { useEventFiltering } from "@/hooks/useEventFiltering";

const FestivalListingsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [festivalListings, setFestivalListings] = useState<EventCardProps[]>([]);
  
  // Load festival data
  useEffect(() => {
    const loadFestivals = async () => {
      try {
        setIsLoading(true);
        
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .eq('country', 'Ireland')
          .eq('is_festival', true)
          .order('raw_date', { ascending: true });

        if (error) throw error;
        
        const mappedEvents: EventCardProps[] = (events || []).map(event => {
          // Extract min and max price from event.raw_data if available
          let price = event.price;
          let maxPrice = undefined;
          
          if (event.raw_data && typeof event.raw_data === 'object') {
            const rawData = event.raw_data as any;
            
            if (rawData.priceRanges && Array.isArray(rawData.priceRanges) && rawData.priceRanges.length > 0) {
              price = rawData.priceRanges[0].min;
              maxPrice = rawData.priceRanges[0].max;
              
              // Only set maxPrice if it's different from price
              if (maxPrice <= price) {
                maxPrice = undefined;
              }
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

        setFestivalListings(mappedEvents);
      } catch (error) {
        console.error("Error loading festival data:", error);
        toast.error("Failed to load festival data");
      } finally {
        setIsLoading(false);
      }
    };

    loadFestivals();
  }, []);

  // Use the filtering hook
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
  } = useEventFiltering({ events: festivalListings });

  return (
    <div>
      <PageHeader 
        title="Festival Listings" 
        subtitle="Discover upcoming festivals in Ireland from Ticketmaster and Eventbrite"
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
      
      <div className="mb-6">
        <p className="text-gray-400">
          {isLoading ? "Loading festivals..." : `${filteredListings.length} festivals found`}
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
            emptyMessage="No festivals found matching your filters. Try adjusting your search."
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

export default FestivalListingsPage;
