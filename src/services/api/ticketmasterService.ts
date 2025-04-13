
import { EventCardProps } from "@/components/ui/EventCard";
import { mapTicketmasterEvents } from "../mappers/ticketmasterMapper";
import { 
  CACHE_DURATION, 
  updateTicketmasterCache,
  getTicketmasterCache
} from "../utils/cacheUtils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  },
  {
    id: "tm-5",
    title: "Red Hot Chili Peppers",
    artist: "Red Hot Chili Peppers",
    venue: "Malahide Castle, Dublin",
    date: "June 20, 2025",
    time: "6:00 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-06-20T18:00:00Z",
    onSaleDate: "2025-04-12T10:00:00Z"
  },
  {
    id: "tm-6",
    title: "Arcade Fire: The Suburbs Anniversary",
    artist: "Arcade Fire",
    venue: "Olympia Theatre, Dublin",
    date: "July 15, 2025",
    time: "8:00 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-07-15T20:00:00Z",
    onSaleDate: "2025-04-20T09:00:00Z"
  },
  {
    id: "tm-7",
    title: "Longitude Festival 2025",
    artist: "Various Artists",
    venue: "Marlay Park, Dublin",
    date: "July 4-6, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival",
    category: "listing",
    rawDate: "2025-07-04T12:00:00Z",
    onSaleDate: "2025-03-01T09:00:00Z"
  },
  {
    id: "tm-8",
    title: "Dua Lipa: Future Nostalgia Tour",
    artist: "Dua Lipa",
    venue: "3Arena, Dublin",
    date: "October 3, 2025",
    time: "7:30 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-10-03T19:30:00Z",
    onSaleDate: "2025-03-25T09:00:00Z"
  }
];

// Function to fetch events from Ticketmaster API
export const fetchTicketmasterEvents = async (): Promise<EventCardProps[]> => {
  console.log("Fetching events from Ticketmaster...");
  
  // First try to get data from Supabase
  try {
    console.log("Checking database for events...");
    
    // Query events from Supabase
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('raw_date', { ascending: true });
    
    if (error) {
      console.error("Error fetching events from database:", error);
    } else if (events && events.length > 0) {
      console.log(`Found ${events.length} events in database`);
      
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
    }
  } catch (dbError) {
    console.error("Database fetch failed, trying API directly:", dbError);
  }
  
  // If no data from database, check cache
  const now = Date.now();
  const cache = getTicketmasterCache();
  
  if (
    cache && 
    cache.data.length > 0 &&
    now - cache.timestamp < CACHE_DURATION
  ) {
    console.log("Using cached Ticketmaster data:", cache.data.length, "events");
    return cache.data;
  }
  
  try {
    // Try to initiate a sync first
    try {
      console.log("Initiating Ticketmaster sync...");
      const syncResponse = await fetch('https://eckohtoprkgolyjdiown.supabase.co/functions/v1/ticketmaster-sync');
      const syncResult = await syncResponse.json();
      console.log("Sync result:", syncResult);
      
      // If sync successful, try to fetch from database again
      if (syncResult.count > 0) {
        const { data: refreshedEvents } = await supabase
          .from('events')
          .select('*')
          .order('raw_date', { ascending: true });
          
        if (refreshedEvents && refreshedEvents.length > 0) {
          console.log(`Got ${refreshedEvents.length} refreshed events from database`);
          
          // Map database events to EventCardProps format
          return refreshedEvents.map(event => ({
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
        }
      }
    } catch (syncError) {
      console.error("Error during sync:", syncError);
    }
    
    // As a last resort, try direct API call
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
    
    // Update cache with new data
    updateTicketmasterCache(events, now, new Date().toISOString());
    
    console.log("Fetched", events.length, "events from Ticketmaster API");
    
    return events;
  } catch (error) {
    console.error("Error fetching from Ticketmaster API:", error);
    
    const cache = getTicketmasterCache();
    // Check if we have any cached data (even if expired)
    if (cache && cache.data.length > 0) {
      console.log("Using expired cached data as fallback");
      return cache.data;
    }
    
    // If API request fails and no cache, use sample data
    console.log("Using sample Ticketmaster data as fallback");
    
    // Store the sample data in cache
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
    // Try to get from database first
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
      
    if (!error && event) {
      return {
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
      };
    }
    
    // If not in database, check cache
    const cache = getTicketmasterCache();
    if (cache && cache.data.length > 0) {
      const cachedEvent = cache.data.find(event => event.id === eventId);
      if (cachedEvent) {
        return cachedEvent;
      }
    }
    
    const apiKey = window.API_KEYS?.ticketmaster;
    
    if (!apiKey) {
      console.error("Ticketmaster API key not found");
      throw new Error("API key not found");
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
