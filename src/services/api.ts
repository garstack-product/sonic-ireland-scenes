
import { EventCardProps } from "@/components/ui/EventCard";
import { fetchTicketmasterEvents, fetchTicketmasterEvent } from "./api/ticketmasterService";
import { fetchArtistData } from "./api/artistService";
import { getTicketmasterCache } from "./utils/cacheUtils";

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

// Fetch events from Ticketmaster
export const fetchAllEvents = async (): Promise<EventCardProps[]> => {
  try {
    const ticketmasterEvents = await fetchTicketmasterEvents();
    
    console.log(`Got ${ticketmasterEvents.length} Ticketmaster events`);
    
    // Sort by date (newest first)
    return ticketmasterEvents.sort((a, b) => {
      if (!a.rawDate || !b.rawDate) return 0;
      const dateA = new Date(a.rawDate);
      const dateB = new Date(b.rawDate);
      return dateA.getTime() - dateB.getTime();
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
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
