
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
      console.log('🔄 LOADING EVENTS FROM DATABASE...');
      
      const mappedEvents = await fetchFutureEventsFromDatabase();
      console.log(`📊 Loaded ${mappedEvents.length} events from database`);
      
      // Set all events first
      setAllEvents(mappedEvents);
      
      // Extract flags from the fresh database data
      const { hiddenIds, featuredIds, festivalIds } = extractEventFlags(mappedEvents);
      
      // Update the state with the database values
      console.log('🎯 SETTING UI STATE FROM DATABASE:');
      console.log('Setting hidden events:', hiddenIds);
      console.log('Setting featured events:', featuredIds);
      console.log('Setting festival events:', festivalIds);
      
      setHiddenEvents(hiddenIds);
      setFeaturedEvents(featuredIds);
      setFestivalEvents(festivalIds);
      
      console.log('✅ Events and flags loaded successfully');
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error loading events:', error);
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
      
      console.log('🚀 FORM SUBMISSION STARTED');
      console.log('📊 Current UI state at submission:');
      console.log('   - Featured events:', featuredEvents);
      console.log('   - Hidden events:', hiddenEvents);
      console.log('   - Festival events:', festivalEvents);
      
      const allEventIds = allEvents.map(event => event.id);
      console.log('   - Total events to manage:', allEventIds.length);
      
      // Perform the database update
      await updateEventFlags(allEventIds, featuredEvents, hiddenEvents, festivalEvents);
      
      console.log('✅ Database update completed successfully');
      toast.success("Events updated successfully!");
      
      // Reload events after a brief delay to ensure database consistency
      console.log('🔄 Reloading events to verify changes...');
      setTimeout(async () => {
        await loadEvents();
        console.log('🎉 Events reloaded and UI state updated');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error saving event settings:', error);
      toast.error('Failed to save event settings. Please try again.');
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

  // Debug current state
  useEffect(() => {
    console.log('🔍 Current UI state changed:');
    console.log('Featured events in state:', featuredEvents);
    console.log('Hidden events in state:', hiddenEvents);
    console.log('Festival events in state:', festivalEvents);
  }, [featuredEvents, hiddenEvents, festivalEvents]);

  useEffect(() => {
    console.log('🏁 Component mounted - loading initial events');
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
