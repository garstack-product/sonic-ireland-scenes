
import { EventCardProps } from "@/components/ui/EventCard";
import { mapEventbriteEvents } from "../mappers/eventbriteMapper";
import { 
  CACHE_DURATION, 
  updateEventbriteCache,
  getEventbriteCache
} from "../utils/cacheUtils";
import { toast } from "sonner";

// Sample data for fallback
const sampleEventbriteEvents: EventCardProps[] = [
  {
    id: "eb-1",
    title: "All Together Now 2025",
    artist: "Various Artists",
    venue: "Curraghmore Estate, Waterford",
    date: "August 1-3, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival",
    category: "listing",
    rawDate: "2025-08-01T12:00:00Z",
    onSaleDate: "2025-02-15T09:00:00Z"
  },
  {
    id: "eb-2",
    title: "Longitude 2025",
    artist: "Various Artists",
    venue: "Marlay Park, Dublin",
    date: "July 5-7, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival",
    category: "listing",
    rawDate: "2025-07-05T12:00:00Z",
    onSaleDate: "2025-01-30T09:00:00Z"
  },
  {
    id: "eb-3",
    title: "Foo Fighters",
    artist: "Foo Fighters",
    venue: "Malahide Castle, Dublin",
    date: "June 22, 2025",
    time: "5:00 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-06-22T17:00:00Z",
    onSaleDate: "2025-04-12T10:00:00Z"
  },
  {
    id: "eb-4",
    title: "Body & Soul 2025",
    artist: "Various Artists",
    venue: "Ballinlough Castle, Co. Westmeath",
    date: "June 20-22, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival",
    category: "listing",
    rawDate: "2025-06-20T12:00:00Z",
    onSaleDate: "2025-03-01T09:00:00Z"
  }
];

export const fetchEventbriteEvents = async (): Promise<EventCardProps[]> => {
  console.log("Fetching events from Eventbrite...");
  
  // Check if we have valid cached data
  const now = Date.now();
  const eventbriteCache = getEventbriteCache();
  
  if (
    eventbriteCache && 
    eventbriteCache.data.length > 0 &&
    now - eventbriteCache.timestamp < CACHE_DURATION
  ) {
    console.log("Using cached Eventbrite data:", eventbriteCache.data.length, "events");
    return eventbriteCache.data;
  }
  
  try {
    // NOTE: Eventbrite API requires OAuth, which is not easy to implement
    // in a frontend-only application. We're using sample data for now.
    console.log("Using sample Eventbrite data");
    
    // Update cache with sample data using the new function
    updateEventbriteCache(sampleEventbriteEvents, now, new Date().toISOString());
    
    return sampleEventbriteEvents;
  } catch (error) {
    console.error("Error with Eventbrite data:", error);
    
    const eventbriteCache = getEventbriteCache();
    // Check if we have any cached data (even if expired)
    if (eventbriteCache && eventbriteCache.data.length > 0) {
      console.log("Using expired cached data as fallback");
      return eventbriteCache.data;
    }
    
    // If something goes wrong, use sample data
    console.log("Using sample Eventbrite data as fallback");
    toast.error("Couldn't retrieve Eventbrite data, using sample data");
    
    return sampleEventbriteEvents;
  }
};

export const fetchEventbriteEvent = async (eventId: string): Promise<EventCardProps | null> => {
  const eventbriteCache = getEventbriteCache();
  // First check if the event is in the cache
  if (eventbriteCache && eventbriteCache.data.length > 0) {
    const cachedEvent = eventbriteCache.data.find(event => event.id === eventId);
    if (cachedEvent) {
      return cachedEvent;
    }
  }
  
  // If not in the cache, check the sample data as fallback
  const sampleEvent = sampleEventbriteEvents.find(event => event.id === eventId);
  if (sampleEvent) {
    return sampleEvent;
  }
  
  return null;
};
