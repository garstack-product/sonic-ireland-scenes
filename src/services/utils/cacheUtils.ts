
import { EventCardProps } from "@/components/ui/EventCard";

export interface CachedData {
  timestamp: number;
  data: EventCardProps[];
  lastFetchDate?: string;
}

// Cache duration in milliseconds (24 hours)
export const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Cache storage
export let ticketmasterCache: CachedData | null = {
  timestamp: 0,
  data: []
};

export let eventbriteCache: CachedData | null = {
  timestamp: 0,
  data: []
};
