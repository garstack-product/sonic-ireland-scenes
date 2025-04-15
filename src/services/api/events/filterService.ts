import { EventCardProps } from "@/components/ui/EventCard";
import { fetchAllEvents } from "./fetchService";

// Get the just announced events
export const fetchJustAnnouncedEvents = async (): Promise<EventCardProps[]> => {
  try {
    const events = await fetchAllEvents();
    
    // Get events with recent on sale dates (within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return events.filter(event => {
      if (event.onSaleDate) {
        const onSaleDate = new Date(event.onSaleDate);
        return onSaleDate > sevenDaysAgo;
      }
      return false;
    }).slice(0, 20); // Limit to 20 events
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

// Get featured events
export const fetchFeaturedEvents = async (): Promise<EventCardProps[]> => {
  try {
    const allEvents = await fetchAllEvents();
    const today = new Date();

    // Filter events that are both featured and upcoming
    return allEvents
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
