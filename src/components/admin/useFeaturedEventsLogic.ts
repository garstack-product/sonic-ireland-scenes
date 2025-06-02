
import { useEffect } from "react";
import { toast } from "sonner";
import { EventCardProps } from "@/components/ui/EventCard";
import { useEventState } from "./hooks/useEventState";
import { fetchFutureEventsFromDatabase, updateEventFlags, fetchCacheMetadata } from "./services/eventDatabase";
import { extractEventFlags, getSortedEvents, createToggleFunction } from "./utils/eventUtils";

export const useFeaturedEventsLogic = () => {
  const {
    searchTerm,
    setSearchTerm,
    featuredEvents,
    setFeaturedEvents,
    isSubmitting,
    setIsSubmitting,
    allEvents,
    setAllEvents,
    isLoading,
    setIsLoading,
    lastSyncInfo,
    setLastSyncInfo,
    sortBy,
    setSortBy,
    hiddenEvents,
    setHiddenEvents,
    festivalEvents,
    setFestivalEvents
  } = useEventState();

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      
      const mappedEvents = await fetchFutureEventsFromDatabase();
      setAllEvents(mappedEvents);
      
      // Set the flags based on database values
      const { hiddenIds, featuredIds, festivalIds } = extractEventFlags(mappedEvents);
      
      setHiddenEvents(hiddenIds);
      setFeaturedEvents(featuredIds);
      setFestivalEvents(festivalIds);
      
      console.log('Events loaded - Featured:', featuredIds, 'Hidden:', hiddenIds, 'Festival:', festivalIds);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
      setIsLoading(false);
    }
  };

  const getLastSyncInfo = async () => {
    const syncInfo = await fetchCacheMetadata();
    setLastSyncInfo(syncInfo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      console.log('=== SAVING CHANGES ===');
      console.log('Current state - Featured events:', featuredEvents);
      console.log('Current state - Hidden events:', hiddenEvents);
      console.log('Current state - Festival events:', festivalEvents);
      
      const allEventIds = allEvents.map(event => event.id);
      console.log('All event IDs:', allEventIds);
      
      await updateEventFlags(allEventIds, featuredEvents, hiddenEvents, festivalEvents);
      
      console.log('Database update completed successfully');
      toast.success("Events updated successfully!");
      
      // Don't reload immediately - give a moment for the database to update
      setTimeout(async () => {
        await loadEvents();
      }, 500);
      
    } catch (error) {
      console.error('Error saving event settings:', error);
      toast.error('Failed to save event settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEventVisibility = createToggleFunction(
    hiddenEvents,
    setHiddenEvents,
    'Toggling visibility'
  );

  const toggleFeature = createToggleFunction(
    featuredEvents,
    setFeaturedEvents,
    'Toggling feature'
  );

  const toggleFestival = createToggleFunction(
    festivalEvents,
    setFestivalEvents,
    'Toggling festival'
  );

  const getSortedEventsWrapper = (events: EventCardProps[]) => {
    return getSortedEvents(events, sortBy, hiddenEvents, featuredEvents, festivalEvents);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return {
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
    getSortedEvents: getSortedEventsWrapper
  };
};
