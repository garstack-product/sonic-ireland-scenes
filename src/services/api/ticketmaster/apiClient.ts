
import { toast } from "sonner";

// Check for API key
export const getTicketmasterApiKey = (): string | null => {
  const apiKey = window.API_KEYS?.ticketmaster;
  if (!apiKey) {
    console.error("Ticketmaster API key not found");
    return null;
  }
  return apiKey;
};

// Make a request to the Ticketmaster API
export const fetchFromTicketmasterApi = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
  const apiKey = getTicketmasterApiKey();
  
  if (!apiKey) {
    throw new Error("API key not found");
  }
  
  // Build query parameters
  const queryParams = new URLSearchParams({
    ...params,
    apikey: apiKey
  });
  
  try {
    const response = await fetch(`https://app.ticketmaster.com/discovery/v2/${endpoint}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Ticketmaster API (${endpoint}):`, error);
    throw error;
  }
};
