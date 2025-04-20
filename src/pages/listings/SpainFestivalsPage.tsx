
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EventFilters from "@/components/events/filters/EventFilters";
import EventListingsStatus from "@/components/events/EventListingsStatus";
import { useEventFiltering } from "@/hooks/useEventFiltering";
import EventSyncButton from "@/components/admin/EventSyncButton";
import { fetchFestivalsByCountry } from "@/services/api/ticketmaster/countryApi";

const SpainFestivalsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [festivals, setFestivals] = useState<EventCardProps[]>([]);
  const [lastSyncInfo, setLastSyncInfo] = useState<string>("Last sync: Unknown");
  
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

  const loadFestivals = async () => {
    try {
      setIsLoading(true);
      
      // First check if we have any events from Spain
      const { count: spainCount, error: countError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('country', 'Spain');
      
      if (countError) throw countError;
      
      console.log(`Found ${spainCount} events for Spain`);
      
      // If database has no results, fetch directly from Ticketmaster
      if (!spainCount || spainCount === 0) {
        console.log("No Spain festivals in database, fetching from Ticketmaster API");
        
        try {
          const apiEvents = await fetchFestivalsByCountry('ES');
          setFestivals(apiEvents);
          
          if (apiEvents.length === 0) {
            toast.info("No festivals found for Spain. Try again later.");
          }
        } catch (apiError) {
          console.error("Error fetching from Ticketmaster API:", apiError);
          toast.error("Failed to load Spanish festivals from API");
        }
        
        setIsLoading(false);
        return;
      }

      // Updated query to ensure we only get festivals from Spain
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('country', 'Spain')
        .eq('is_festival', true)
        .order('raw_date', { ascending: true });

      if (error) throw error;

      // Get last sync time
      const { data: cacheMeta } = await supabase
        .from('cache_metadata')
        .select('last_updated, status')
        .eq('id', 'ticketmaster')
        .single();

      if (cacheMeta) {
        const lastSync = new Date(cacheMeta.last_updated);
        setLastSyncInfo(`Last sync: ${lastSync.toLocaleString()} - ${cacheMeta.status}`);
      }

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
      console.error("Error loading Spanish festivals:", error);
      toast.error("Failed to load Spanish festivals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFestivals();
  }, []);

  return (
    <div>
      <PageHeader 
        title="Spanish Festivals" 
        subtitle="Discover upcoming festivals in Spain"
      />

      <div className="mb-6">
        <EventSyncButton 
          isLoading={isLoading} 
          onSyncComplete={loadFestivals}
          lastSyncInfo={lastSyncInfo}
        />
      </div>
      
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
            emptyMessage="No festivals found matching your filters. Please try syncing data."
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

export default SpainFestivalsPage;
