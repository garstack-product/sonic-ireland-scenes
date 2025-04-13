
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

// Update ticketmaster cache with new data
export const updateTicketmasterCache = (data: EventCardProps[], timestamp: number, lastFetchDate?: string): void => {
  ticketmasterCache = {
    timestamp,
    data,
    lastFetchDate
  };
  saveToLocalStorage('ticketmasterCache', ticketmasterCache);
};

// Clear cache for ticketmaster
export const clearCache = (): void => {
  ticketmasterCache = {
    timestamp: 0,
    data: []
  };
  saveToLocalStorage('ticketmasterCache', ticketmasterCache);
};

// Load cache from localStorage on module init
export const initCaches = (): void => {
  ticketmasterCache = getFromLocalStorage<CachedData>('ticketmasterCache', ticketmasterCache);
};

// Initialize caches
initCaches();
