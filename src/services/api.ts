
import { API_KEYS } from "@/config/api-keys";
import { EventCardProps } from "@/components/ui/EventCard";
import ticketmasterEvents from "@/config/ticketmaster-events.json";

interface CachedData {
  timestamp: number;
  data: EventCardProps[];
}

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

// Format time from API to readable format (e.g., "6:30pm")
const formatTime = (time: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? 'pm' : 'am';
  const hour12 = hourNum % 12 || 12; // Convert 0 to 12 for 12am
  return `${hour12}:${minute}${period}`;
};

// Format date from API to readable format (e.g., "January 1, 2025")
const formatDate = (date: string) => {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Map Ticketmaster events to our application format
const mapTicketmasterEvents = (events: any[]): EventCardProps[] => {
  return events.map((event: any) => {
    // Extract genre and subgenre information
    const genre = event.classifications?.[0]?.genre?.name || "";
    const subgenre = event.classifications?.[0]?.subGenre?.name || "";
    
    // Get venue info
    const venue = event._embedded?.venues?.[0]?.name || "";
    const city = event._embedded?.venues?.[0]?.city?.name || "";
    const venueFull = city ? `${venue}, ${city}` : venue;
    
    // Get price info
    const minPrice = event.priceRanges?.[0]?.min || 0;
    const maxPrice = event.priceRanges?.[0]?.max || 0;
    
    // Get image
    const imageUrl = event.images?.find((img: any) => img.ratio === "16_9" && img.width > 500)?.url 
      || event.images?.[0]?.url 
      || "/placeholder.svg";
      
    // Get date and time
    const startDate = event.dates?.start?.localDate || "";
    const startTime = event.dates?.start?.localTime || "";
    const formattedDate = formatDate(startDate);
    const formattedTime = formatTime(startTime);
    
    return {
      id: event.id,
      title: event.name,
      artist: event.name.includes(":") ? event.name.split(":")[0] : event._embedded?.attractions?.[0]?.name || "",
      venue: venueFull,
      date: formattedDate,
      time: formattedTime,
      imageUrl: imageUrl,
      type: "concert" as const,
      category: "listing" as const,
      genre: genre !== "Undefined" ? genre : undefined,
      subgenre: subgenre !== "Undefined" ? subgenre : undefined,
      price: minPrice,
      ticketUrl: event.url // Add ticket URL
    };
  });
};

// Cache storage
let ticketmasterCache: CachedData | null = null;
let eventbriteCache: CachedData | null = null;

// Load events from local JSON file and cache them
export const fetchTicketmasterEvents = async (): Promise<EventCardProps[]> => {
  // Check if we have cached data that's still valid
  if (ticketmasterCache && (Date.now() - ticketmasterCache.timestamp < CACHE_DURATION)) {
    console.log("Using cached Ticketmaster data");
    return ticketmasterCache.data;
  }
  
  try {
    console.log("Loading Ticketmaster data from local JSON file");
    
    // Fix: Access the events array correctly from the JSON structure
    const eventsData = ticketmasterEvents.events || [];
    
    // Map events from the local JSON file
    const mappedEvents = mapTicketmasterEvents(eventsData);
    
    // Update cache
    ticketmasterCache = {
      timestamp: Date.now(),
      data: mappedEvents
    };
    
    return mappedEvents;
  } catch (error) {
    console.error("Error loading Ticketmaster data from local file:", error);
    
    // Return cached data if available, even if expired
    if (ticketmasterCache) {
      console.log("Using expired Ticketmaster cache due to error");
      return ticketmasterCache.data;
    }
    
    throw error;
  }
};

// Fetch Eventbrite events (placeholder for now)
export const fetchEventbriteEvents = async (): Promise<EventCardProps[]> => {
  // Check if we have cached data that's still valid
  if (eventbriteCache && (Date.now() - eventbriteCache.timestamp < CACHE_DURATION)) {
    console.log("Using cached Eventbrite data");
    return eventbriteCache.data;
  }
  
  try {
    console.log("Fetching fresh Eventbrite data");
    // Note: Eventbrite API integration would go here
    // This is a placeholder until we have a proper Eventbrite integration
    
    const mockEventbriteEvents: EventCardProps[] = [];
    
    // Update cache
    eventbriteCache = {
      timestamp: Date.now(),
      data: mockEventbriteEvents
    };
    
    return mockEventbriteEvents;
  } catch (error) {
    console.error("Error fetching Eventbrite data:", error);
    
    // Return cached data if available, even if expired
    if (eventbriteCache) {
      console.log("Using expired Eventbrite cache due to error");
      return eventbriteCache.data;
    }
    
    return [];
  }
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
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw error;
  }
};

// Get artist data from API
export const fetchArtistData = async (artistName: string) => {
  try {
    // In a real app, this would fetch from a music API like MusicBrainz, Spotify, etc.
    // For demo purposes, we'll return mock data
    return {
      name: artistName,
      bio: `${artistName} is a renowned artist with a unique sound that blends various genres into an unforgettable musical experience.`,
      imageUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=1470&auto=format&fit=crop",
      links: {
        website: "https://example.com",
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
        spotify: "https://spotify.com",
        youtube: "https://youtube.com",
        itunes: "https://music.apple.com",
        musicbrainz: "https://musicbrainz.org",
        wikipedia: "https://wikipedia.org"
      }
    };
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return null;
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
