import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchTicketmasterEvents } from "./ticketmasterService";

// Force a sync with Ticketmaster API
export const syncTicketmasterEvents = async (): Promise<{ success: boolean, message: string }> => {
  try {
    console.log("Forcing Ticketmaster sync...");
    const response = await fetch('https://eckohtoprkgolyjdiown.supabase.co/functions/v1/ticketmaster-sync');
    
    if (!response.ok) {
      throw new Error(`Sync failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    return { 
      success: true, 
      message: result.refreshed 
        ? `Successfully refreshed ${result.count} events` 
        : `Using cached data (${result.count} events)` 
    };
  } catch (error) {
    console.error("Error syncing with Ticketmaster:", error);
    return { success: false, message: `Sync failed: ${error.message}` };
  }
};

// Fetch events from database
export const fetchAllEvents = async (): Promise<EventCardProps[]> => {
  try {
    console.log("Fetching events from Supabase database...");
    
    // Check cache age
    let needsRefresh = false;
    try {
      const { data: cacheInfo } = await supabase
        .from('cache_metadata')
        .select('last_updated')
        .eq('id', 'ticketmaster')
        .single();
        
      if (cacheInfo) {
        const lastUpdated = new Date(cacheInfo.last_updated);
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        if (lastUpdated < oneDayAgo) {
          console.log("Cache is older than 24 hours, triggering background sync");
          needsRefresh = true;
        }
      } else {
        // No cache record found
        needsRefresh = true;
      }
    } catch (cacheError) {
      console.warn("Error checking cache age:", cacheError);
      needsRefresh = true;
    }
    
    // Try to trigger a sync in the background if needed
    if (needsRefresh) {
      try {
        const syncResponse = await fetch('https://eckohtoprkgolyjdiown.supabase.co/functions/v1/ticketmaster-sync');
        const syncResult = await syncResponse.json();
        console.log("Sync result:", syncResult);
      } catch (syncError) {
        console.warn("Background sync failed, proceeding with existing data:", syncError);
      }
    }
    
    // Query events from Supabase
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('raw_date', { ascending: true });
    
    if (error) {
      console.error("Error fetching events from database:", error);
      // Fallback to the original Ticketmaster API service
      return fetchTicketmasterEvents();
    }

    if (!events || events.length === 0) {
      console.log("No events found in database, falling back to API");
      return fetchTicketmasterEvents();
    }
    
    console.log(`Got ${events.length} events from database`);
    
    // Map database events to EventCardProps format
    return events.map(event => ({
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
      onSaleDate: event.on_sale_date || null
    }));
  } catch (error) {
    console.error("Error in fetchAllEvents:", error);
    // Fallback to the original Ticketmaster service
    toast.error("Error fetching events from database. Falling back to API.");
    return fetchTicketmasterEvents();
  }
};

// Get the just announced events (not visible in previous API calls)
export const fetchJustAnnouncedEvents = async (): Promise<EventCardProps[]> => {
  try {
    const events = await fetchAllEvents();
    
    // Get events with recent on sale dates (within last 7 days) or newly discovered events
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return events.filter(event => {
      if (event.onSaleDate) {
        const onSaleDate = new Date(event.onSaleDate);
        return onSaleDate > sevenDaysAgo;
      }
      return false;
    }).slice(0, 8); // Limit to 8 events
  } catch (error) {
    console.error("Error in fetchJustAnnouncedEvents:", error);
    return [];
  }
};

// Get upcoming events in the next X days
export const fetchUpcomingEvents = async (days: number = 7): Promise<EventCardProps[]> => {
  try {
    const events = await fetchAllEvents();
    
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return events.filter(event => {
      if (!event.rawDate) return false;
      
      const eventDate = new Date(event.rawDate);
      return eventDate >= today && eventDate <= futureDate;
    }).slice(0, 12); // Limit to 12 events for carousel
  } catch (error) {
    console.error("Error in fetchUpcomingEvents:", error);
    return [];
  }
};

// Get featured events from local storage
export const fetchFeaturedEvents = async (): Promise<EventCardProps[]> => {
  try {
    const allEvents = await fetchAllEvents();
    const today = new Date();

    // First, filter events that are both featured and upcoming
    const upcomingFeaturedEvents = allEvents
      .filter(event => {
        if (!event.rawDate) return false;
        
        const eventDate = new Date(event.rawDate);
        return eventDate >= today && event.is_featured === true;
      })
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.rawDate || 0);
        const dateB = new Date(b.rawDate || 0);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 10); // Limit to 10 events

    return upcomingFeaturedEvents;
  } catch (error) {
    console.error("Error in fetchFeaturedEvents:", error);
    return [];
  }
};

// Fetch events at a specific venue
export const fetchVenueEvents = async (venueName: string): Promise<EventCardProps[]> => {
  try {
    const allEvents = await fetchAllEvents();
    return allEvents.filter(event => event.venue.includes(venueName));
  } catch (error) {
    console.error(`Error fetching events for venue ${venueName}:`, error);
    return [];
  }
};
