import { EventCardProps } from "@/components/ui/EventCard";
import { mapTicketmasterEvents } from "../mappers/ticketmasterMapper";
import { 
  CACHE_DURATION, 
  updateTicketmasterCache
} from "../utils/cacheUtils";
import { toast } from "sonner";

// Sample data for fallback
const sampleTicketmasterEvents: EventCardProps[] = [
  {
    id: "tm-1",
    title: "Coldplay: Music of the Spheres Tour",
    artist: "Coldplay",
    venue: "Croke Park, Dublin",
    date: "August 30, 2025",
    time: "6:30 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-08-30T18:30:00Z",
    onSaleDate: "2025-04-01T09:00:00Z"
  },
  {
    id: "tm-2",
    title: "Taylor Swift: The Eras Tour",
    artist: "Taylor Swift",
    venue: "Aviva Stadium, Dublin",
    date: "June 28-30, 2025",
    time: "7:00 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-06-28T19:00:00Z",
    onSaleDate: "2025-04-10T10:00:00Z"
  },
  {
    id: "tm-3",
    title: "Electric Picnic 2025",
    artist: "Various Artists",
    venue: "Stradbally Hall, Co. Laois",
    date: "September 5-7, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival",
    category: "listing",
    rawDate: "2025-09-05T12:00:00Z",
    onSaleDate: "2025-03-15T09:00:00Z"
  },
  {
    id: "tm-4",
    title: "Billie Eilish: Hit Me Hard and Soft Tour",
    artist: "Billie Eilish",
    venue: "3Arena, Dublin",
    date: "May 15, 2025",
    time: "8:00 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-05-15T20:00:00Z",
    onSaleDate: "2025-04-05T09:00:00Z"
  }
];

// Function to fetch events from Ticketmaster API
export const fetchTicketmasterEvents = async (): Promise<EventCardProps[]> => {
  console.log("Fetching events from Ticketmaster...");
  
  // Check if we have valid cached data
  const now = Date.now();
  if (
    ticketmasterCache && 
    ticketmasterCache.data.length > 0 &&
    now - ticketmasterCache.timestamp < CACHE_DURATION
  ) {
    console.log("Using cached Ticketmaster data:", ticketmasterCache.data.length, "events");
    return ticketmasterCache.data;
  }
  
  try {
    const apiKey = window.API_KEYS?.ticketmaster;
    
    if (!apiKey) {
      console.error("Ticketmaster API key not found");
      throw new Error("API key not found");
    }
    
    // Fetch events from Ticketmaster API for Ireland
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=IE&size=300&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data._embedded || !data._embedded.events) {
      console.warn("No events found in Ticketmaster response");
      throw new Error("No events found in API response");
    }
    
    // Map Ticketmaster events to our EventCard format
    const events = mapTicketmasterEvents(data._embedded.events);
    
    // Update cache using the new function
    updateTicketmasterCache(events, now, new Date().toISOString());
    
    console.log("Fetched", events.length, "events from Ticketmaster API");
    
    return events;
  } catch (error) {
    console.error("Error fetching from Ticketmaster API:", error);
    
    // Check if we have any cached data (even if expired)
    if (ticketmasterCache && ticketmasterCache.data.length > 0) {
      console.log("Using expired cached data as fallback");
      return ticketmasterCache.data;
    }
    
    // If API request fails and no cache, use sample data
    console.log("Using sample Ticketmaster data as fallback");
    
    // Store the sample data in cache using the new function
    updateTicketmasterCache(
      sampleTicketmasterEvents,
      now - CACHE_DURATION + 60000, // Set to expire soon but not immediately
      new Date().toISOString()
    );
    
    toast.error("Couldn't connect to Ticketmaster API, using sample data");
    
    return sampleTicketmasterEvents;
  }
};

// Function to fetch a specific event from Ticketmaster API
export const fetchTicketmasterEvent = async (eventId: string): Promise<EventCardProps | null> => {
  try {
    // First check if the event is in the cache
    if (ticketmasterCache && ticketmasterCache.data.length > 0) {
      const cachedEvent = ticketmasterCache.data.find(event => event.id === eventId);
      if (cachedEvent) {
        return cachedEvent;
      }
    }
    
    const apiKey = window.API_KEYS?.ticketmaster;
    
    if (!apiKey) {
      console.error("Ticketmaster API key not found");
      return null;
    }
    
    // Fetch event details from Ticketmaster API
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
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
