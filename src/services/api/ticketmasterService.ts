
import { API_KEYS } from "@/config/api-keys";
import { EventCardProps } from "@/components/ui/EventCard";
import ticketmasterEventsData from "@/config/ticketmaster-events.json";
import { mapTicketmasterEvents } from "../mappers/ticketmasterMapper";
import { ticketmasterCache, CACHE_DURATION } from "../utils/cacheUtils";

// Fetch events directly from Ticketmaster API
export const fetchTicketmasterEvents = async (): Promise<EventCardProps[]> => {
  // Check if we have cached data that's still valid
  if (ticketmasterCache && (Date.now() - ticketmasterCache.timestamp < CACHE_DURATION)) {
    console.log("Using cached Ticketmaster data");
    return ticketmasterCache.data;
  }
  
  try {
    console.log("Fetching fresh Ticketmaster data");
    
    // First try to fetch from the API
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=IE&size=300&apikey=${API_KEYS.TICKETMASTER}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we have events in the response
    if (!data._embedded || !data._embedded.events) {
      throw new Error("No events found in API response");
    }
    
    const eventsArray = data._embedded.events;
    console.log(`Found ${eventsArray.length} events from API`);
    
    // Map events
    const mappedEvents = mapTicketmasterEvents(eventsArray);
    
    console.log(`Mapped ${mappedEvents.length} events successfully`);
    
    // Store current fetch date for "just announced" logic
    const currentDate = new Date().toISOString();
    
    // Update cache
    ticketmasterCache.timestamp = Date.now();
    ticketmasterCache.data = mappedEvents;
    ticketmasterCache.lastFetchDate = currentDate;
    
    return mappedEvents;
  } catch (error) {
    console.error("Error fetching Ticketmaster data from API:", error);
    
    // If API fetch fails, try using the local JSON file as fallback
    try {
      console.log("Falling back to local JSON file");
      // Extract the events array from the JSON structure
      const eventsArray = Array.isArray(ticketmasterEventsData) 
        ? ticketmasterEventsData 
        : (ticketmasterEventsData as any)._embedded?.events || [];
      
      console.log(`Found ${eventsArray.length} events in JSON file`);
      
      // Map events from the JSON structure
      const mappedEvents = mapTicketmasterEvents(eventsArray);
      
      console.log(`Mapped ${mappedEvents.length} events successfully from local JSON`);
      
      // Update cache
      ticketmasterCache.timestamp = Date.now();
      ticketmasterCache.data = mappedEvents;
      
      return mappedEvents;
    } catch (fallbackError) {
      console.error("Error loading from local file:", fallbackError);
      
      // Return cached data if available, even if expired
      if (ticketmasterCache) {
        console.log("Using expired Ticketmaster cache due to errors");
        return ticketmasterCache.data;
      }
      
      return [];
    }
  }
};
