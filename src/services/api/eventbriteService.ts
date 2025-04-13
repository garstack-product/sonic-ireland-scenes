
import { API_KEYS } from "@/config/api-keys";
import { EventCardProps } from "@/components/ui/EventCard";
import { mapEventbriteEvents } from "../mappers/eventbriteMapper";
import { eventbriteCache, CACHE_DURATION } from "../utils/cacheUtils";

// Fetch Eventbrite events
export const fetchEventbriteEvents = async (): Promise<EventCardProps[]> => {
  // Check if we have cached data that's still valid
  if (eventbriteCache && (Date.now() - eventbriteCache.timestamp < CACHE_DURATION)) {
    console.log("Using cached Eventbrite data");
    return eventbriteCache.data;
  }
  
  try {
    console.log("Fetching fresh Eventbrite data");
    
    // Use a proxy or backend function to fetch Eventbrite events (client-side CORS issues)
    const apiUrl = `https://www.eventbriteapi.com/v3/events/search/?location.address=ireland&categories=103&token=${API_KEYS.EVENTBRITE}`;
    
    // Note: In a real app, this would need to go through a server proxy due to CORS
    // For demo purposes, we're returning mock data
    
    // Mock Eventbrite events for now - in production this should use real API data
    const mockEventbriteEvents: EventCardProps[] = [
      {
        id: "eb-123456",
        title: "Irish Folk Music Festival",
        artist: "Various Irish Artists",
        venue: "The Button Factory, Dublin",
        date: "May 15, 2025",
        time: "7:00pm",
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop",
        type: "concert",
        category: "listing",
        genre: "Folk",
        price: 25,
        ticketUrl: "https://www.eventbrite.com/e/irish-folk-music-festival-tickets-123456",
        rawDate: "2025-05-15",
        onSaleDate: "2025-03-15T10:00:00Z"
      },
      {
        id: "eb-234567",
        title: "Dublin Jazz Night",
        artist: "Dublin Jazz Ensemble",
        venue: "The Sugar Club, Dublin",
        date: "May 20, 2025",
        time: "8:30pm",
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1374&auto=format&fit=crop",
        type: "concert",
        category: "listing",
        genre: "Jazz",
        price: 18,
        ticketUrl: "https://www.eventbrite.com/e/dublin-jazz-night-tickets-234567",
        rawDate: "2025-05-20",
        onSaleDate: "2025-03-20T09:00:00Z"
      },
      {
        id: "eb-345678",
        title: "Electric Ireland",
        artist: "Various Electronic Artists",
        venue: "District 8, Dublin",
        date: "June 5, 2025",
        time: "10:00pm",
        imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1470&auto=format&fit=crop",
        type: "festival",
        category: "listing",
        genre: "Electronic",
        price: 45,
        ticketUrl: "https://www.eventbrite.com/e/electric-ireland-tickets-345678",
        rawDate: "2025-06-05",
        onSaleDate: "2025-04-05T08:00:00Z"
      },
      {
        id: "eb-456789",
        title: "Singer-Songwriter Showcase",
        artist: "Various Artists",
        venue: "Whelan's, Dublin",
        date: "May 25, 2025",
        time: "8:00pm",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1470&auto=format&fit=crop",
        type: "concert",
        category: "listing",
        genre: "Acoustic",
        price: 15,
        ticketUrl: "https://www.eventbrite.com/e/singer-songwriter-showcase-tickets-456789",
        rawDate: "2025-05-25",
        onSaleDate: "2025-04-01T10:00:00Z"
      },
      {
        id: "eb-567890",
        title: "Galway International Arts Festival",
        artist: "Various International Artists",
        venue: "Various Venues, Galway",
        date: "July 12-25, 2025",
        time: "Various Times",
        imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1470&auto=format&fit=crop",
        type: "festival",
        category: "listing",
        genre: "Arts",
        price: 0,
        ticketUrl: "https://www.eventbrite.com/e/galway-international-arts-festival-tickets-567890",
        rawDate: "2025-07-12",
        onSaleDate: "2025-03-01T09:00:00Z"
      }
    ];
    
    // Update cache
    eventbriteCache.timestamp = Date.now();
    eventbriteCache.data = mockEventbriteEvents;
    
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
