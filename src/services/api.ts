
import { API_KEYS } from "@/config/api-keys";
import { EventCardProps } from "@/components/ui/EventCard";
import ticketmasterEventsData from "@/config/ticketmaster-events.json";

interface CachedData {
  timestamp: number;
  data: EventCardProps[];
  lastFetchDate?: string;
}

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

// List of sports genres/subgenres to filter out
const SPORTS_GENRES = [
  'Rugby',
  'GAA',
  'Football',
  'Sports',
  'Basketball',
  'Soccer',
  'Baseball',
  'Hockey',
  'Cricket',
];

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

// Check if an event is a sports event
const isSportsEvent = (event: any): boolean => {
  const genre = event.classifications?.[0]?.genre?.name || "";
  const subgenre = event.classifications?.[0]?.subGenre?.name || "";
  const segment = event.classifications?.[0]?.segment?.name || "";
  
  return SPORTS_GENRES.some(sportGenre => 
    genre.includes(sportGenre) || 
    subgenre.includes(sportGenre) || 
    segment.includes(sportGenre)
  );
};

// Map Ticketmaster events to our application format
const mapTicketmasterEvents = (events: any[]): EventCardProps[] => {
  return events
    .filter(event => !isSportsEvent(event))
    .map((event: any) => {
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
      
      // Try to extract artist name from name or attractions
      let artistName = "";
      if (event._embedded?.attractions?.[0]?.name) {
        artistName = event._embedded.attractions[0].name;
      } else if (event.name && event.name.includes(":")) {
        artistName = event.name.split(":")[0].trim();
      } else {
        artistName = event.name;
      }
      
      return {
        id: event.id || `custom-${Math.random().toString(36).substr(2, 9)}`,
        title: event.name || "",
        artist: artistName,
        venue: venueFull,
        date: formattedDate,
        time: formattedTime,
        imageUrl: imageUrl,
        type: "concert" as const,
        category: "listing" as const,
        genre: genre !== "Undefined" ? genre : undefined,
        subgenre: subgenre !== "Undefined" ? subgenre : undefined,
        price: minPrice,
        ticketUrl: event.url, // Add ticket URL
        rawDate: startDate, // Add raw date for filtering
        onSaleDate: event.sales?.public?.startDateTime || null // When tickets went on sale
      };
    });
};

// Cache storage
let ticketmasterCache: CachedData | null = null;
let eventbriteCache: CachedData | null = null;

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
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=IE&size=90&apikey=${API_KEYS.TICKETMASTER}`;
    
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
    ticketmasterCache = {
      timestamp: Date.now(),
      data: mappedEvents,
      lastFetchDate: currentDate
    };
    
    return mappedEvents;
  } catch (error) {
    console.error("Error fetching Ticketmaster data from API:", error);
    
    // If API fetch fails, try using the local JSON file as fallback
    try {
      console.log("Falling back to local JSON file");
      // Extract the events array from the JSON structure
      const eventsArray = Array.isArray(ticketmasterEventsData) 
        ? ticketmasterEventsData 
        : ticketmasterEventsData.events || [];
      
      console.log(`Found ${eventsArray.length} events in JSON file`);
      
      // Map events from the JSON structure
      const mappedEvents = mapTicketmasterEvents(eventsArray);
      
      console.log(`Mapped ${mappedEvents.length} events successfully from local JSON`);
      
      // Update cache
      ticketmasterCache = {
        timestamp: Date.now(),
        data: mappedEvents
      };
      
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
export const fetchUpcomingEvents = async (days: number = 3): Promise<EventCardProps[]> => {
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

// Get artist data from API
export const fetchArtistData = async (artistName: string) => {
  try {
    // In a real app, this would fetch from a music API like MusicBrainz, Spotify, etc.
    // For demo purposes, we'll return mock data with realistic URLs
    return {
      name: artistName,
      bio: `${artistName} is a renowned artist with a unique sound that blends various genres into an unforgettable musical experience.`,
      imageUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=1470&auto=format&fit=crop",
      links: {
        website: artistName.toLowerCase().includes("primal") ? "https://www.primalscream.net/" : null,
        facebook: artistName.toLowerCase().includes("primal") ? "https://www.facebook.com/primalscreamofficial" : null,
        twitter: artistName.toLowerCase().includes("primal") ? "https://twitter.com/ScreamOfficial" : null,
        wikipedia: artistName.toLowerCase().includes("primal") ? "https://en.wikipedia.org/wiki/Primal_Scream" : null,
        instagram: null,
        spotify: null,
        youtube: null,
        itunes: null,
        musicbrainz: null
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
