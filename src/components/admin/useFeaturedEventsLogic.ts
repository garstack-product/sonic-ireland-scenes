import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchAllEvents } from "@/services/api";
import { EventCardProps } from "@/components/ui/EventCard";
import { supabase } from "@/integrations/supabase/client";

export const useFeaturedEventsLogic = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<string[]>([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allEvents, setAllEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncInfo, setLastSyncInfo] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [hiddenEvents, setHiddenEvents] = useState<string[]>([]);
  const [festivalEvents, setFestivalEvents] = useState<string[]>([]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      
      const events = await fetchAllEvents();
      setAllEvents(events);
      
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('id, is_hidden, is_featured, is_festival');
      
      if (error) {
        throw error;
      }
        
      if (eventsData) {
        setHiddenEvents(eventsData.filter(event => event.is_hidden).map(event => event.id));
        setFeaturedEvents(eventsData.filter(event => event.is_featured).map(event => event.id));
        setFestivalEvents(eventsData.filter(event => event.is_festival).map(event => event.id));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
      setIsLoading(false);
    }
  };

  const getLastSyncInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('cache_metadata')
        .select('last_updated, record_count')
        .eq('id', 'ticketmaster')
        .single();
      
      if (error) {
        console.error("Error fetching last sync info:", error);
        setLastSyncInfo("No sync information available");
        return;
      }
      
      if (data) {
        const lastSyncDate = new Date(data.last_updated);
        const formattedDate = lastSyncDate.toLocaleString();
        setLastSyncInfo(`Last synced: ${formattedDate} (${data.record_count} events)`);
      } else {
        setLastSyncInfo("No sync information available");
      }
    } catch (error) {
      console.error("Error fetching sync info:", error);
      setLastSyncInfo("Error fetching sync info");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      console.log('Updating events with featured status:', featuredEvents);
      console.log('Updating events with hidden status:', hiddenEvents);
      console.log('Updating events with festival status:', festivalEvents);
      
      // Update each event individually to ensure proper handling
      for (const event of allEvents) {
        const isFeatured = featuredEvents.includes(event.id);
        const isHidden = hiddenEvents.includes(event.id);
        const isFestival = festivalEvents.includes(event.id);
        
        console.log(`Updating event ${event.id}: featured=${isFeatured}, hidden=${isHidden}, festival=${isFestival}`);
        
        const { error } = await supabase
          .from('events')
          .update({ 
            is_featured: isFeatured,
            is_hidden: isHidden,
            is_festival: isFestival
          })
          .eq('id', event.id);
          
        if (error) {
          console.error('Error updating event:', event.id, error);
          throw error;
        }
      }
      
      toast.success("Events updated successfully!");
      // Reload events to reflect changes
      await loadEvents();
    } catch (error) {
      console.error('Error saving event settings:', error);
      toast.error('Failed to save event settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEventVisibility = (id: string) => {
    console.log('Toggling visibility for event:', id);
    setHiddenEvents(prev => {
      const newHidden = prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id];
      console.log('New hidden events:', newHidden);
      return newHidden;
    });
  };

  const toggleFeature = (id: string) => {
    console.log('Toggling feature for event:', id);
    setFeaturedEvents(prev => {
      const newFeatured = prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id];
      console.log('New featured events:', newFeatured);
      return newFeatured;
    });
  };

  const toggleFestival = (id: string) => {
    console.log('Toggling festival for event:', id);
    setFestivalEvents(prev => {
      const newFestival = prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id];
      console.log('New festival events:', newFestival);
      return newFestival;
    });
  };

  const getSortedEvents = (events: EventCardProps[]) => {
    return [...events].sort((a, b) => {
      switch (sortBy) {
        case "visibility":
          const aHidden = hiddenEvents.includes(a.id);
          const bHidden = hiddenEvents.includes(b.id);
          if (aHidden !== bHidden) return aHidden ? 1 : -1;
          break;
        case "featured":
          const aFeatured = featuredEvents.includes(a.id);
          const bFeatured = featuredEvents.includes(b.id);
          if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;
          break;
        case "festival":
          const aFestival = festivalEvents.includes(a.id);
          const bFestival = festivalEvents.includes(b.id);
          if (aFestival !== bFestival) return aFestival ? -1 : 1;
          break;
        case "date":
        default:
          const aDate = new Date(a.rawDate || a.date);
          const bDate = new Date(b.rawDate || b.date);
          return aDate.getTime() - bDate.getTime();
      }
      // Default secondary sort by date
      const aDate = new Date(a.rawDate || a.date);
      const bDate = new Date(b.rawDate || b.date);
      return aDate.getTime() - bDate.getTime();
    });
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
    getSortedEvents
  };
};
