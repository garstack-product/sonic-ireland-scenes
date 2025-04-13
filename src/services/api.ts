
import { EventCardProps } from "@/components/ui/EventCard";
import { fetchTicketmasterEvents } from "./api/ticketmasterService";
import { fetchEventbriteEvents } from "./api/eventbriteService";
import { fetchArtistData } from "./api/artistService";
import { ticketmasterCache, eventbriteCache } from "./utils/cacheUtils";

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
  
  if (!savedFeaturedIds) return [];
  
  const featuredIds = JSON.parse(savedFeaturedIds);
  return allEvents.filter(event => featuredIds.includes(event.id));
};

// Fetch events from all sources
export const fetchAllEvents = async (): Promise<EventCardProps[]> => {
  try {
    const [ticketmasterEvents, eventbriteEvents] = await Promise.all([
      fetchTicketmasterEvents(),
      fetchEventbriteEvents()
    ]);
    
    // Combine and sort by date (newest first)
    return [...ticketmasterEvents, ...eventbriteEvents].sort((a, b) => {
      if (!a.rawDate || !b.rawDate) return 0;
      const dateA = new Date(a.rawDate);
      const dateB = new Date(b.rawDate);
      return dateA.getTime() - dateB.getTime();
    });
  } catch (error) {
    console.error("Error fetching all events:", error);
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
  fetchEventbriteEvents,
  fetchArtistData
};
