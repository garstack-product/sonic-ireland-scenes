
import { EventCardProps } from "@/components/ui/EventCard";
import { fetchTicketmasterEvents, fetchTicketmasterEvent } from "./api/ticketmasterService";
import { fetchArtistData } from "./api/artistService";
import { getTicketmasterCache } from "./utils/cacheUtils";
import { supabase } from "@/integrations/supabase/client";

// Get the just announced events (not visible in previous API calls)
export const fetchJustAnnouncedEvents = async (): Promise<EventCardProps[]> => {
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
};

// Get upcoming events in the next X days
export const fetchUpcomingEvents = async (days: number = 7): Promise<EventCardProps[]> => {
  const events = await fetchAllEvents();
  
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return events.filter(event => {
    if (!event.rawDate) return false;
    
    const eventDate = new Date(event.rawDate);
    return eventDate >= today && eventDate <= futureDate;
  }).slice(0, 12); // Limit to 12 events for carousel
};

// Get featured events from local storage
export const fetchFeaturedEvents = async (): Promise<EventCardProps[]> => {
  const allEvents = await fetchAllEvents();
  const savedFeaturedIds = localStorage.getItem('featuredEvents');
  
  if (!savedFeaturedIds) {
    // Use some default events as featured if none are set
    return allEvents.slice(0, 4);
  }
  
  try {
    const featuredIds = JSON.parse(savedFeaturedIds);
    const featured = allEvents.filter(event => featuredIds.includes(event.id));
    
    // If no matched events found, return some defaults
    if (featured.length === 0) {
      return allEvents.slice(0, 4);
    }
    
    return featured;
  } catch (error) {
    console.error("Error parsing featured events:", error);
    return allEvents.slice(0, 4);
  }
};

// Fetch events from database
export const fetchAllEvents = async (): Promise<EventCardProps[]> => {
  try {
    console.log("Fetching events from Supabase database...");
    
    // Try to trigger a sync first (this will only update if data is stale)
    try {
      const syncResponse = await fetch('https://eckohtoprkgolyjdiown.supabase.co/functions/v1/ticketmaster-sync');
      const syncResult = await syncResponse.json();
      console.log("Sync result:", syncResult);
    } catch (syncError) {
      console.warn("Background sync failed, proceeding with existing data:", syncError);
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
    return fetchTicketmasterEvents();
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

// Re-export individual services for direct access
export { 
  fetchTicketmasterEvents,
  fetchTicketmasterEvent,
  fetchArtistData
};
