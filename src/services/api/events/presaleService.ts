
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

// Get events with presale dates (Ireland only, future only)
export const fetchPresaleEvents = async (): Promise<EventCardProps[]> => {
  try {
    const events = await fetchAllEvents();
    
    // Filter for Ireland events first
    const irelandEvents = filterIrelandEvents(events);
    
    // Filter for future events only
    const futureEvents = filterFutureEvents(irelandEvents);
    
    // Filter for events that have presale/on sale dates
    return futureEvents.filter(event => {
      // Skip sports events
      if (event.genre === 'GAA' || event.genre === 'Sports' || 
          event.subgenre === 'GAA' || event.subgenre === 'Sports') {
        return false;
      }
      
      // Check if the event has an on sale date (presale date)
      return event.onSaleDate !== null && event.onSaleDate !== undefined;
    })
    .sort((a, b) => {
      // Sort by on sale date (presale date) - earliest first
      const dateA = new Date(a.onSaleDate || 0);
      const dateB = new Date(b.onSaleDate || 0);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 100); // Limit to 100 events
  } catch (error) {
    console.error("Error in fetchPresaleEvents:", error);
    return [];
  }
};
