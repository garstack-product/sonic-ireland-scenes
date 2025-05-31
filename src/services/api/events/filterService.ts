
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

// Helper function to filter for future events only
const filterFutureEvents = (events: EventCardProps[]): EventCardProps[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today
  
  return events.filter(event => {
    if (!event.rawDate) return false;
    
    const eventDate = new Date(event.rawDate);
    return eventDate >= today;
  });
};

// Get the just announced events (Ireland only, future only)
export const fetchJustAnnouncedEvents = async (): Promise<EventCardProps[]> => {
  try {
    const events = await fetchAllEvents();
    
    // Filter for Ireland events first
    const irelandEvents = filterIrelandEvents(events);
    
    // Filter for future events only
    const futureEvents = filterFutureEvents(irelandEvents);
    
    // Get events with recent on sale dates (within last 30 days) OR recently created events
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return futureEvents.filter(event => {
      // Skip sports events
      if (event.genre === 'GAA' || event.genre === 'Sports' || 
          event.subgenre === 'GAA' || event.subgenre === 'Sports') {
        return false;
      }
      
      // Check if the event has a recent on sale date
      if (event.onSaleDate) {
        const onSaleDate = new Date(event.onSaleDate);
        if (onSaleDate > thirtyDaysAgo) {
          return true;
        }
      }
      
      // Fallback: if no onSaleDate, check if the event is within a reasonable range
      if (event.rawDate) {
        const eventDate = new Date(event.rawDate);
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        
        // Include events that are within 6 months
        return eventDate < sixMonthsFromNow;
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

// Get upcoming events in the next X days (Ireland only, future only)
export const fetchUpcomingEvents = async (days: number = 7): Promise<EventCardProps[]> => {
  try {
    const events = await fetchAllEvents();
    
    // Filter for Ireland events first
    const irelandEvents = filterIrelandEvents(events);
    
    // Filter for future events only
    const futureEvents = filterFutureEvents(irelandEvents);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    // Filter for events in the next X days and exclude sports/GAA
    return futureEvents.filter(event => {
      // Skip sports events
      if (event.genre === 'GAA' || event.genre === 'Sports' || 
          event.subgenre === 'GAA' || event.subgenre === 'Sports') {
        return false;
      }
      
      const eventDate = new Date(event.rawDate);
      return eventDate <= futureDate;
    });
  } catch (error) {
    console.error("Error in fetchUpcomingEvents:", error);
    return [];
  }
};

// Get featured events (Ireland only, future only)
export const fetchFeaturedEvents = async (): Promise<EventCardProps[]> => {
  try {
    const allEvents = await fetchAllEvents();
    
    // Filter for Ireland events first
    const irelandEvents = filterIrelandEvents(allEvents);
    
    // Filter for future events only
    const futureEvents = filterFutureEvents(irelandEvents);

    // Filter events that are both featured and upcoming in Ireland
    return futureEvents
      .filter(event => {
        // Skip sports events
        if (event.genre === 'GAA' || event.genre === 'Sports' || 
            event.subgenre === 'GAA' || event.subgenre === 'Sports') {
          return false;
        }
        return event.is_featured === true;
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

// Fetch events at a specific venue (future only)
export const fetchVenueEvents = async (venueName: string): Promise<EventCardProps[]> => {
  try {
    const allEvents = await fetchAllEvents();
    
    // Filter for future events only
    const futureEvents = filterFutureEvents(allEvents);
    
    return futureEvents.filter(event => 
      event.venue.includes(venueName) &&
      // Skip sports events
      event.genre !== 'GAA' && 
      event.genre !== 'Sports' && 
      event.subgenre !== 'GAA' && 
      event.subgenre !== 'Sports'
    );
  } catch (error) {
    console.error(`Error fetching events for venue ${venueName}:`, error);
    return [];
  }
};
