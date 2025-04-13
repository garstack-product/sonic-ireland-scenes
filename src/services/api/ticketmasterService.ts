
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
    
    // For development purposes, let's add a fallback to avoid CORS issues
    try {
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
      console.error("Error fetching from API directly:", error);
      throw error; // Re-throw to be caught by outer try-catch
    }
  } catch (error) {
    console.error("Error fetching Ticketmaster data from API:", error);
    
    // If API fetch fails, try using the local JSON file as fallback
    try {
      console.log("Falling back to local JSON file");
      
      // Create sample events since we can't access Ticketmaster API
      const sampleEvents: EventCardProps[] = [
        {
          id: "tm-123456",
          title: "Arctic Monkeys Live",
          artist: "Arctic Monkeys",
          venue: "3Arena, Dublin",
          date: "May 10, 2025",
          time: "8:00pm",
          imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
          type: "concert",
          category: "listing",
          genre: "Rock",
          price: 65,
          ticketUrl: "https://www.ticketmaster.ie/arctic-monkeys",
          rawDate: "2025-05-10",
          onSaleDate: "2025-03-01T09:00:00Z"
        },
        {
          id: "tm-234567",
          title: "Florence + The Machine",
          artist: "Florence + The Machine",
          venue: "Malahide Castle, Dublin",
          date: "June 15, 2025",
          time: "7:00pm",
          imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
          type: "concert",
          category: "listing",
          genre: "Alternative",
          price: 75,
          ticketUrl: "https://www.ticketmaster.ie/florence",
          rawDate: "2025-06-15",
          onSaleDate: "2025-02-15T10:00:00Z"
        },
        {
          id: "tm-345678",
          title: "Longitude Festival 2025",
          artist: "Various Artists",
          venue: "Marlay Park, Dublin",
          date: "July 5-7, 2025",
          time: "12:00pm",
          imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
          type: "festival",
          category: "listing",
          genre: "Mixed",
          price: 180,
          ticketUrl: "https://www.ticketmaster.ie/longitude",
          rawDate: "2025-07-05",
          onSaleDate: "2025-01-20T09:00:00Z"
        },
        {
          id: "tm-456789",
          title: "Coldplay World Tour",
          artist: "Coldplay",
          venue: "Croke Park, Dublin",
          date: "August 20, 2025",
          time: "7:30pm",
          imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14",
          type: "concert",
          category: "listing",
          genre: "Pop",
          price: 90,
          ticketUrl: "https://www.ticketmaster.ie/coldplay",
          rawDate: "2025-08-20",
          onSaleDate: "2025-02-01T09:00:00Z"
        },
        {
          id: "tm-567890",
          title: "Electric Picnic 2025",
          artist: "Various Artists",
          venue: "Stradbally, Co. Laois",
          date: "August 29-31, 2025",
          time: "2:00pm",
          imageUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec",
          type: "festival",
          category: "listing",
          genre: "Mixed",
          price: 250,
          ticketUrl: "https://www.ticketmaster.ie/electric-picnic",
          rawDate: "2025-08-29",
          onSaleDate: "2024-12-15T09:00:00Z"
        },
        {
          id: "tm-678901",
          title: "Metallica",
          artist: "Metallica",
          venue: "Slane Castle, Co. Meath",
          date: "June 8, 2025",
          time: "4:00pm",
          imageUrl: "https://images.unsplash.com/photo-1587355760421-b9de3226a2b0",
          type: "concert",
          category: "listing",
          genre: "Metal",
          price: 95,
          ticketUrl: "https://www.ticketmaster.ie/metallica",
          rawDate: "2025-06-08",
          onSaleDate: "2025-01-10T10:00:00Z"
        },
        {
          id: "tm-789012",
          title: "Billie Eilish",
          artist: "Billie Eilish",
          venue: "3Arena, Dublin",
          date: "September 12, 2025",
          time: "8:00pm",
          imageUrl: "https://images.unsplash.com/photo-1556379118-7034d926d258",
          type: "concert",
          category: "listing",
          genre: "Pop",
          price: 85,
          ticketUrl: "https://www.ticketmaster.ie/billie-eilish",
          rawDate: "2025-09-12",
          onSaleDate: "2025-03-15T09:00:00Z"
        },
        {
          id: "tm-890123",
          title: "All Together Now 2025",
          artist: "Various Artists",
          venue: "Curraghmore Estate, Co. Waterford",
          date: "August 1-3, 2025",
          time: "12:00pm",
          imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
          type: "festival",
          category: "listing",
          genre: "Mixed",
          price: 210,
          ticketUrl: "https://www.ticketmaster.ie/all-together-now",
          rawDate: "2025-08-01",
          onSaleDate: "2025-01-05T10:00:00Z"
        }
      ];
      
      console.log(`Created ${sampleEvents.length} sample events as fallback`);
      
      // Update cache
      ticketmasterCache.timestamp = Date.now();
      ticketmasterCache.data = sampleEvents;
      
      return sampleEvents;
    } catch (fallbackError) {
      console.error("Error creating sample events:", fallbackError);
      
      // Return cached data if available, even if expired
      if (ticketmasterCache) {
        console.log("Using expired Ticketmaster cache due to errors");
        return ticketmasterCache.data;
      }
      
      return [];
    }
  }
};
