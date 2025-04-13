
import { EventCardProps } from "@/components/ui/EventCard";
import { mapTicketmasterEvents } from "../mappers/ticketmasterMapper";
import { toast } from "sonner";
import { CACHE_DURATION } from "../utils/cacheUtils";
import { sampleTicketmasterEvents } from "../data/sampleTicketmasterEvents";
import { 
  fetchEventsFromDatabase, 
  fetchEventFromDatabase,
  triggerEventSync 
} from "./ticketmaster/dbOperations";
import { 
  fetchFromTicketmasterApi,
  getTicketmasterApiKey
} from "./ticketmaster/apiClient";
import {
  getValidCacheData,
  getExpiredCacheData,
  saveToCacheWithTimestamp
} from "./ticketmaster/cacheService";

// Function to fetch events from Ticketmaster API
export const fetchTicketmasterEvents = async (): Promise<EventCardProps[]> => {
  console.log("Fetching events from Ticketmaster...");
  
  // First try to get data from Supabase
  const dbEvents = await fetchEventsFromDatabase();
  if (dbEvents && dbEvents.length > 0) {
    return dbEvents;
  }
  
  // If no data from database, check cache
  const cachedEvents = getValidCacheData();
  if (cachedEvents) {
    return cachedEvents;
  }
  
  try {
    // Try to initiate a sync first
    const syncResult = await triggerEventSync();
    
    // If sync successful, try to fetch from database again
    if (syncResult && syncResult.count > 0) {
      const refreshedEvents = await fetchEventsFromDatabase();
      if (refreshedEvents && refreshedEvents.length > 0) {
        return refreshedEvents;
      }
    }
    
    // As a last resort, try direct API call
    const apiKey = getTicketmasterApiKey();
    if (!apiKey) {
      throw new Error("API key not found");
    }
    
    // Fetch events from Ticketmaster API for Ireland
    const data = await fetchFromTicketmasterApi('events.json', { countryCode: 'IE', size: '300' });
    
    if (!data._embedded || !data._embedded.events) {
      console.warn("No events found in Ticketmaster response");
      throw new Error("No events found in API response");
    }
    
    // Map Ticketmaster events to our EventCard format
    const events = mapTicketmasterEvents(data._embedded.events);
    
    // Update cache with new data
    const now = Date.now();
    saveToCacheWithTimestamp(events, now);
    
    console.log("Fetched", events.length, "events from Ticketmaster API");
    
    return events;
  } catch (error) {
    console.error("Error fetching from Ticketmaster API:", error);
    
    // Check if we have any cached data (even if expired)
    const expiredCacheEvents = getExpiredCacheData();
    if (expiredCacheEvents) {
      return expiredCacheEvents;
    }
    
    // If API request fails and no cache, use sample data
    console.log("Using sample Ticketmaster data as fallback");
    
    // Store the sample data in cache
    saveToCacheWithTimestamp(
      sampleTicketmasterEvents,
      Date.now() - CACHE_DURATION + 60000 // Set to expire soon but not immediately
    );
    
    toast.error("Couldn't connect to Ticketmaster API, using sample data");
    
    return sampleTicketmasterEvents;
  }
};

// Function to fetch a specific event from Ticketmaster API
export const fetchTicketmasterEvent = async (eventId: string): Promise<EventCardProps | null> => {
  try {
    // Try to get from database first
    const dbEvent = await fetchEventFromDatabase(eventId);
    if (dbEvent) {
      return dbEvent;
    }
    
    // If not in database, check cache
    const cache = getValidCacheData();
    if (cache) {
      const cachedEvent = cache.find(event => event.id === eventId);
      if (cachedEvent) {
        return cachedEvent;
      }
    }
    
    // If not in cache, fetch from API
    const apiKey = getTicketmasterApiKey();
    if (!apiKey) {
      throw new Error("API key not found");
    }
    
    // Fetch event details from Ticketmaster API
    const data = await fetchFromTicketmasterApi(`events/${eventId}.json`);
    return mapTicketmasterEvents([data])[0];
  } catch (error) {
    console.error("Error fetching Ticketmaster event:", error);
    
    // Check if we can find the event in our sample data as a fallback
    const sampleEvent = sampleTicketmasterEvents.find(event => event.id === eventId);
    if (sampleEvent) {
      return sampleEvent;
    }
    
    return null;
  }
};
