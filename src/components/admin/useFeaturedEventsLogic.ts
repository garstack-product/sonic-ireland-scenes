
import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { EventCardProps } from "@/components/ui/EventCard";
import { useEventState } from "./hooks/useEventState";
import { fetchFutureEventsFromDatabase, updateEventFlags, fetchCacheMetadata } from "./services/eventDatabase";
import { extractEventFlags, getSortedEvents } from "./utils/eventUtils";

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
      console.log('Loading events from database...');
      
      const mappedEvents = await fetchFutureEventsFromDatabase();
      setAllEvents(mappedEvents);
      
      // Set the flags based on database values
      const { hiddenIds, featuredIds, festivalIds } = extractEventFlags(mappedEvents);
      
      console.log('Setting state from database:');
      console.log('- Hidden IDs:', hiddenIds);
      console.log('- Featured IDs:', featuredIds);
      console.log('- Festival IDs:', festivalIds);
      
      setHiddenEvents(hiddenIds);
      setFeaturedEvents(featuredIds);
      setFestivalEvents(festivalIds);
      
      setIsLoading(false);
      console.log('Events loaded successfully');
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
      
      console.log('=== FORM SUBMISSION STARTED ===');
      console.log('Current state when submitting:');
      console.log('- Featured events:', featuredEvents);
      console.log('- Hidden events:', hiddenEvents);
      console.log('- Festival events:', festivalEvents);
      
      const allEventIds = allEvents.map(event => event.id);
      console.log('- All event IDs:', allEventIds);
      
      // Call the database update function
      await updateEventFlags(allEventIds, featuredEvents, hiddenEvents, festivalEvents);
      
      console.log('Database update completed - showing success message');
      toast.success("Events updated successfully!");
      
      // Reload events after a short delay to ensure database consistency
      console.log('Reloading events to verify changes...');
      setTimeout(async () => {
        await loadEvents();
      }, 1000);
      
    } catch (error) {
      console.error('Error saving event settings:', error);
      toast.error('Failed to save event settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simplified toggle functions that directly use setters
  const toggleEventVisibility = useCallback((id: string) => {
    console.log('=== TOGGLING VISIBILITY ===');
    console.log(`Event ID: ${id}`);
    
    setHiddenEvents(currentHidden => {
      const isCurrentlyHidden = currentHidden.includes(id);
      let newHidden;
      
      if (isCurrentlyHidden) {
        newHidden = currentHidden.filter(eventId => eventId !== id);
        console.log(`Removing ${id} from hidden events`);
      } else {
        newHidden = [...currentHidden, id];
        console.log(`Adding ${id} to hidden events`);
      }
      
      console.log(`Was hidden: ${isCurrentlyHidden}`);
      console.log(`New hidden events:`, newHidden);
      
      return newHidden;
    });
  }, [setHiddenEvents]);

  const toggleFeature = useCallback((id: string) => {
    console.log('=== TOGGLING FEATURE ===');
    console.log(`Event ID: ${id}`);
    
    setFeaturedEvents(currentFeatured => {
      const isCurrentlyFeatured = currentFeatured.includes(id);
      let newFeatured;
      
      if (isCurrentlyFeatured) {
        newFeatured = currentFeatured.filter(eventId => eventId !== id);
        console.log(`Removing ${id} from featured events`);
      } else {
        newFeatured = [...currentFeatured, id];
        console.log(`Adding ${id} to featured events`);
      }
      
      console.log(`Was featured: ${isCurrentlyFeatured}`);
      console.log(`New featured events:`, newFeatured);
      
      return newFeatured;
    });
  }, [setFeaturedEvents]);

  const toggleFestival = useCallback((id: string) => {
    console.log('=== TOGGLING FESTIVAL ===');
    console.log(`Event ID: ${id}`);
    
    setFestivalEvents(currentFestival => {
      const isCurrentlyFestival = currentFestival.includes(id);
      let newFestival;
      
      if (isCurrentlyFestival) {
        newFestival = currentFestival.filter(eventId => eventId !== id);
        console.log(`Removing ${id} from festival events`);
      } else {
        newFestival = [...currentFestival, id];
        console.log(`Adding ${id} to festival events`);
      }
      
      console.log(`Was festival: ${isCurrentlyFestival}`);
      console.log(`New festival events:`, newFestival);
      
      return newFestival;
    });
  }, [setFestivalEvents]);

  const getSortedEventsWrapper = (events: EventCardProps[]) => {
    return getSortedEvents(events, sortBy, hiddenEvents, featuredEvents, festivalEvents);
  };

  useEffect(() => {
    console.log('Component mounted - loading initial events');
    loadEvents();
  }, []);

  // Debug current state changes
  useEffect(() => {
    console.log('=== STATE CHANGED ===');
    console.log('Featured events:', featuredEvents);
    console.log('Hidden events:', hiddenEvents);
    console.log('Festival events:', festivalEvents);
  }, [featuredEvents, hiddenEvents, festivalEvents]);

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
