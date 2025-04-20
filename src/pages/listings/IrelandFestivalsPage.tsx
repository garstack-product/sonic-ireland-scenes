
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import EventFilters from "@/components/events/filters/EventFilters";
import EventListingsStatus from "@/components/events/EventListingsStatus";
import { useEventFiltering } from "@/hooks/useEventFiltering";
import { fetchFestivalsByCountry } from "@/services/api/ticketmaster/countryApi";
import EventSyncButton from "@/components/admin/EventSyncButton";

const IrelandFestivalsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [festivals, setFestivals] = useState<EventCardProps[]>([]);
  const [lastSyncInfo, setLastSyncInfo] = useState<string>("Last sync: Unknown");

  const loadFestivals = async () => {
    try {
      setIsLoading(true);
      const events = await fetchFestivalsByCountry('IE');
      setFestivals(events);
    } catch (error) {
      console.error("Error loading Irish festivals:", error);
      toast.error("Failed to load Irish festivals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFestivals();
  }, []);

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

  return (
    <div>
      <PageHeader 
        title="Irish Festivals" 
        subtitle="Discover upcoming festivals in Ireland"
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

export default IrelandFestivalsPage;
