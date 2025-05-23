
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EventFilters from "@/components/events/filters/EventFilters";
import EventListingsStatus from "@/components/events/EventListingsStatus";
import { useEventFiltering } from "@/hooks/useEventFiltering";
import { fetchFestivalsByCountry } from "@/services/api/ticketmaster/countryApi";

const FranceFestivalsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [festivals, setFestivals] = useState<EventCardProps[]>([]);
  
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
  } = useEventFiltering({ events: festivals });

  useEffect(() => {
    const loadFestivals = async () => {
      try {
        setIsLoading(true);
        
        // First try to get from database
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .eq('country', 'France')
          .eq('is_festival', true)
          .order('raw_date', { ascending: true });

        if (error) throw error;

        // If database has no results, fetch directly from Ticketmaster
        if (!events || events.length === 0) {
          console.log("No France festivals in database, fetching from Ticketmaster API");
          
          try {
            const apiEvents = await fetchFestivalsByCountry('FR');
            setFestivals(apiEvents);
            
            if (apiEvents.length === 0) {
              toast.info("No festivals found for France. Try again later.");
            }
          } catch (apiError) {
            console.error("Error fetching from Ticketmaster API:", apiError);
            toast.error("Failed to load French festivals from API");
          }
          
          setIsLoading(false);
          return;
        }

        // Map database events to our format
        const mappedEvents: EventCardProps[] = (events || []).map(event => {
          let price = event.price;
          let maxPrice = undefined;
          
          if (event.raw_data && typeof event.raw_data === 'object') {
            const rawData = event.raw_data as any;
            
            if (rawData.priceRanges && Array.isArray(rawData.priceRanges) && rawData.priceRanges.length > 0) {
              price = rawData.priceRanges[0].min;
              maxPrice = rawData.priceRanges[0].max;
              
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

        setFestivals(mappedEvents);
      } catch (error) {
        console.error("Error loading French festivals:", error);
        toast.error("Failed to load French festivals");
      } finally {
        setIsLoading(false);
      }
    };

    loadFestivals();
  }, []);

  return (
    <div>
      <PageHeader 
        title="French Festivals" 
        subtitle="Discover upcoming festivals in France"
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
            emptyMessage="No festivals found matching your filters."
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

export default FranceFestivalsPage;
