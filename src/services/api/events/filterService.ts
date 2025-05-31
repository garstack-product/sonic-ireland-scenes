
import { EventCardProps } from "@/components/ui/EventCard";
import { fetchAllEvents } from "./fetchService";

// Helper function to filter events for Ireland only
const filterIrelandEvents = (events: EventCardProps[]): EventCardProps[] => {
  return events.filter(event => {
    // Check if event is in Ireland based on country field or venue location
    const isIreland = event.country === 'Ireland' || 
                     event.venue?.toLowerCase().includes('dublin') ||
                     event.venue?.toLowerCase().includes('cork') ||
                     event.venue?.toLowerCase().includes('galway') ||
                     event.venue?.toLowerCase().includes('belfast') ||
                     event.venue?.toLowerCase().includes('limerick') ||
                     event.venue?.toLowerCase().includes('waterford') ||
                     event.venue?.toLowerCase().includes('kilkenny') ||
                     event.venue?.toLowerCase().includes('derry') ||
                     event.venue?.toLowerCase().includes('ireland');
    
    return isIreland;
  });
};

// Get the just announced events (Ireland only)
export const fetchJustAnnouncedEvents = async (): Promise<EventCardProps[]> => {
  try {
    const events = await fetchAllEvents();
    
    // Filter for Ireland events first
    const irelandEvents = filterIrelandEvents(events);
    
    // Get events with recent on sale dates (within last 30 days) OR recently created events
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const today = new Date();
    
    return irelandEvents.filter(event => {
      // Skip sports events
      if (event.genre === 'GAA' || event.genre === 'Sports' || 
          event.subgenre === 'GAA' || event.subgenre === 'Sports') {
        return false;
      }
      
      // Only include future events
      if (event.rawDate) {
        const eventDate = new Date(event.rawDate);
        if (eventDate < today) {
          return false;
        }
      }
      
      // Check if the event has a recent on sale date
      if (event.onSaleDate) {
        const onSaleDate = new Date(event.onSaleDate);
        if (onSaleDate > thirtyDaysAgo) {
          return true;
        }
      }
      
      // Fallback: if no onSaleDate, check if the event is in the future and within a reasonable range
      if (event.rawDate) {
        const eventDate = new Date(event.rawDate);
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(today.getMonth() + 6);
        
        // Include events that are in the future and within 6 months
        return eventDate > today && eventDate < sixMonthsFromNow;
      }
      
      return false;
    })
    .sort((a, b) => {
      // Sort by onSaleDate if available, otherwise by rawDate
      const dateA = new Date(a.onSaleDate || a.rawDate || 0);
      const dateB = new Date(b.onSaleDate || b.rawDate || 0);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    })
    .slice(0, 50); // Limit to 50 events
  } catch (error) {
    console.error("Error in fetchJustAnnouncedEvents:", error);
    return [];
  }
};

// Get upcoming events in the next X days (Ireland only)
export const fetchUpcomingEvents = async (days: number = 7): Promise<EventCardProps[]> => {
  try {
    const events = await fetchAllEvents();
    
    // Filter for Ireland events first
    const irelandEvents = filterIrelandEvents(events);
    
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    // Filter for events in the next 7 days and exclude sports/GAA
    return irelandEvents.filter(event => {
      if (!event.rawDate) return false;
      
      // Skip sports events
      if (event.genre === 'GAA' || event.genre === 'Sports' || 
          event.subgenre === 'GAA' || event.subgenre === 'Sports') {
        return false;
      }
      
      const eventDate = new Date(event.rawDate);
      return eventDate >= today && eventDate <= futureDate;
    });
  } catch (error) {
    console.error("Error in fetchUpcomingEvents:", error);
    return [];
  }
};

// Get featured events (Ireland only)
export const fetchFeaturedEvents = async (): Promise<EventCardProps[]> => {
  try {
    const allEvents = await fetchAllEvents();
    
    // Filter for Ireland events first
    const irelandEvents = filterIrelandEvents(allEvents);
    
    const today = new Date();

    // Filter events that are both featured and upcoming in Ireland
    return irelandEvents
      .filter(event => {
        if (!event.rawDate) return false;
        // Skip sports events
        if (event.genre === 'GAA' || event.genre === 'Sports' || 
            event.subgenre === 'GAA' || event.subgenre === 'Sports') {
          return false;
        }
        const eventDate = new Date(event.rawDate);
        return eventDate >= today && event.is_featured === true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.rawDate || 0);
        const dateB = new Date(b.rawDate || 0);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 10); // ENFORCE limit to 10 events
  } catch (error) {
    console.error("Error in fetchFeaturedEvents:", error);
    return [];
  }
};

// Fetch events at a specific venue
export const fetchVenueEvents = async (venueName: string): Promise<EventCardProps[]> => {
  try {
    const allEvents = await fetchAllEvents();
    const today = new Date();
    
    return allEvents.filter(event => 
      event.venue.includes(venueName) &&
      // Skip sports events
      event.genre !== 'GAA' && 
      event.genre !== 'Sports' && 
      event.subgenre !== 'GAA' && 
      event.subgenre !== 'Sports' &&
      // Only future events
      (event.rawDate ? new Date(event.rawDate) >= today : true)
    );
  } catch (error) {
    console.error(`Error fetching events for venue ${venueName}:`, error);
    return [];
  }
};
