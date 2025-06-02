
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
      
      // Get current date for filtering future events only
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Fetch events directly from database instead of API to ensure we have the correct flags
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .gte('raw_date', today.toISOString()) // Only get future events
        .order('raw_date', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (eventsData) {
        // Map database events to EventCardProps format
        const mappedEvents: EventCardProps[] = eventsData.map(event => ({
          id: event.id,
          title: event.title,
          artist: event.artist || '',
          venue: event.venue || '',
          date: event.date || '',
          time: event.time || '',
          imageUrl: event.image_url || '/placeholder.svg',
          type: (event.type as 'concert' | 'festival') || 'concert',
          category: 'listing' as const,
          genre: event.genre || undefined,
          subgenre: event.subgenre || undefined,
          price: event.price || undefined,
          ticketUrl: event.ticket_url || undefined,
          rawDate: event.raw_date || undefined,
          onSaleDate: event.on_sale_date || null,
          is_featured: event.is_featured,
          is_hidden: event.is_hidden
        }));
        
        setAllEvents(mappedEvents);
        
        // Set the flags based on database values
        const hiddenIds = eventsData.filter(event => event.is_hidden).map(event => event.id);
        const featuredIds = eventsData.filter(event => event.is_featured).map(event => event.id);
        const festivalIds = eventsData.filter(event => event.is_festival).map(event => event.id);
        
        console.log('Loading events - Featured IDs from DB:', featuredIds);
        console.log('Loading events - Hidden IDs from DB:', hiddenIds);
        console.log('Loading events - Festival IDs from DB:', festivalIds);
        
        setHiddenEvents(hiddenIds);
        setFeaturedEvents(featuredIds);
        setFestivalEvents(festivalIds);
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
      
      console.log('Saving changes - Featured events:', featuredEvents);
      console.log('Saving changes - Hidden events:', hiddenEvents);
      console.log('Saving changes - Festival events:', festivalEvents);
      
      // First, reset all flags to false for all events we're managing
      const allEventIds = allEvents.map(event => event.id);
      const { error: resetError } = await supabase
        .from('events')
        .update({ 
          is_featured: false,
          is_hidden: false,
          is_festival: false
        })
        .in('id', allEventIds);
      
      if (resetError) {
        console.error('Error resetting event flags:', resetError);
        throw resetError;
      }
      
      // Then set the flags to true for the selected events
      const updates = [];
      
      if (featuredEvents.length > 0) {
        updates.push(
          supabase
            .from('events')
            .update({ is_featured: true })
            .in('id', featuredEvents)
        );
      }
      
      if (hiddenEvents.length > 0) {
        updates.push(
          supabase
            .from('events')
            .update({ is_hidden: true })
            .in('id', hiddenEvents)
        );
      }
      
      if (festivalEvents.length > 0) {
        updates.push(
          supabase
            .from('events')
            .update({ is_festival: true })
            .in('id', festivalEvents)
        );
      }
      
      // Execute all updates
      if (updates.length > 0) {
        const results = await Promise.all(updates);
        
        // Check for errors
        for (const result of results) {
          if (result.error) {
            console.error('Error updating event flags:', result.error);
            throw result.error;
          }
        }
      }
      
      console.log('All updates completed successfully');
      toast.success("Events updated successfully!");
      
      // Reload the events to ensure UI is in sync with database
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
