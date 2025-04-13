
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import VenuesList from "@/components/map/VenuesList";
import VenueEventsList from "@/components/map/VenueEventsList";
import VenueMap from "@/components/map/VenueMap";
import { useVenues } from "@/hooks/useVenues";

const MapPage = () => {
  const {
    venues,
    isLoading,
    selectedVenue,
    showEvents,
    handleVenueClick,
    handleBackToVenues,
    setSelectedVenue
  } = useVenues();

  return (
    <div>
      <PageHeader 
        title="Event Map" 
        subtitle="Discover events by location across Ireland"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Sidebar */}
        <div className="md:col-span-1 bg-dark-300 p-4 rounded-lg h-[70vh] overflow-y-auto">
          {showEvents && selectedVenue ? (
            <VenueEventsList 
              venue={selectedVenue} 
              onBackClick={handleBackToVenues} 
            />
          ) : (
            <VenuesList 
              venues={venues} 
              isLoading={isLoading} 
              onVenueClick={handleVenueClick} 
            />
          )}
        </div>
        
        {/* Map */}
        <div className="md:col-span-2 bg-dark-300 rounded-lg overflow-hidden h-[70vh]">
          <VenueMap 
            venues={venues} 
            selectedVenue={selectedVenue} 
            onVenueSelect={handleVenueClick} 
          />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
