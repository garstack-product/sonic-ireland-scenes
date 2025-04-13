
import { EventCardProps } from "@/components/ui/EventCard";

export interface CachedData {
  timestamp: number;
  data: EventCardProps[];
  lastFetchDate?: string;
  source?: string;
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

// Helper functions for local storage
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

// Get ticketmaster cache
export const getTicketmasterCache = (): CachedData => {
  return ticketmasterCache || { timestamp: 0, data: [] };
};

// Get eventbrite cache
export const getEventbriteCache = (): CachedData => {
  return eventbriteCache || { timestamp: 0, data: [] };
};

// Update ticketmaster cache with new data
export const updateTicketmasterCache = (data: EventCardProps[], timestamp: number, lastFetchDate?: string): void => {
  ticketmasterCache = {
    timestamp,
    data,
    lastFetchDate
  };
  saveToLocalStorage('ticketmasterCache', ticketmasterCache);
};

// Update eventbrite cache with new data
export const updateEventbriteCache = (data: EventCardProps[], timestamp: number, lastFetchDate?: string): void => {
  eventbriteCache = {
    timestamp,
    data,
    lastFetchDate
  };
  saveToLocalStorage('eventbriteCache', eventbriteCache);
};

// Clear cache for a specific provider
export const clearCache = (provider: 'ticketmaster' | 'eventbrite'): void => {
  if (provider === 'ticketmaster') {
    ticketmasterCache = {
      timestamp: 0,
      data: []
    };
    saveToLocalStorage('ticketmasterCache', ticketmasterCache);
  } else if (provider === 'eventbrite') {
    eventbriteCache = {
      timestamp: 0,
      data: []
    };
    saveToLocalStorage('eventbriteCache', eventbriteCache);
  }
};

// Clear all caches
export const clearAllCaches = (): void => {
  clearCache('ticketmaster');
  clearCache('eventbrite');
};

// Load caches from localStorage on module init
export const initCaches = (): void => {
  ticketmasterCache = getFromLocalStorage<CachedData>('ticketmasterCache', ticketmasterCache);
  eventbriteCache = getFromLocalStorage<CachedData>('eventbriteCache', eventbriteCache);
};

// Initialize caches
initCaches();
