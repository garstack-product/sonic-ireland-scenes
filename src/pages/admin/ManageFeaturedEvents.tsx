
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import EventsList from "@/components/admin/EventsList";
import FeaturedEventsHeader from "@/components/admin/FeaturedEventsHeader";
import FeaturedEventsFilters from "@/components/admin/FeaturedEventsFilters";
import FeaturedEventsStats from "@/components/admin/FeaturedEventsStats";
import { useFeaturedEventsLogic } from "@/components/admin/useFeaturedEventsLogic";

const ManageFeaturedEvents = () => {
  const {
    searchTerm,
    setSearchTerm,
    featuredEvents,
    isSubmitting,
    allEvents,
    isLoading,
    lastSyncInfo,
    sortBy,
    setSortBy,
    hiddenEvents,
    festivalEvents,
    loadEvents,
    getLastSyncInfo,
    handleSubmit,
    toggleEventVisibility,
    toggleFeature,
    toggleFestival,
    getSortedEvents
  } = useFeaturedEventsLogic();

  const filteredEvents = allEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEvents = getSortedEvents(filteredEvents);

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <FeaturedEventsHeader
        isLoading={isLoading}
        onSyncComplete={async () => {
          await loadEvents();
          await getLastSyncInfo();
        }}
        lastSyncInfo={lastSyncInfo}
      />
      
      <FeaturedEventsFilters
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearchChange={setSearchTerm}
        onSortChange={setSortBy}
      />
      
      <form onSubmit={handleSubmit}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <EventsList
            events={sortedEvents}
            hiddenEvents={hiddenEvents}
            festivalEvents={festivalEvents}
            featuredEvents={featuredEvents}
            onToggleVisibility={toggleEventVisibility}
            onToggleFestival={toggleFestival}
            onToggleFeature={toggleFeature}
          />
        )}
        
        <div className="flex justify-between items-center">
          <FeaturedEventsStats
            featuredCount={featuredEvents.length}
            festivalCount={festivalEvents.length}
            hiddenCount={hiddenEvents.length}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageFeaturedEvents;
