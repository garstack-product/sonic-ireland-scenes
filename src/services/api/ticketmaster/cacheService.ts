
import { EventCardProps } from "@/components/ui/EventCard";
import { 
  CACHE_DURATION,
  getTicketmasterCache,
  updateTicketmasterCache
} from "../../utils/cacheUtils";

// Check if we have valid cache data
export const getValidCacheData = (): EventCardProps[] | null => {
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
  
  return null;
};

// Get expired cache data as fallback
export const getExpiredCacheData = (): EventCardProps[] | null => {
  const cache = getTicketmasterCache();
  if (cache && cache.data.length > 0) {
    console.log("Using expired cached data as fallback");
    return cache.data;
  }
  return null;
};

// Save data to cache
export const saveToCacheWithTimestamp = (
  events: EventCardProps[], 
  timestamp: number = Date.now(),
  fetchDate: string = new Date().toISOString()
): void => {
  updateTicketmasterCache(events, timestamp, fetchDate);
  console.log("Updated cache with", events.length, "events");
};
