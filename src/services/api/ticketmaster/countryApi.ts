
import { fetchFromTicketmasterApi } from "./apiClient";
import { EventCardProps } from "@/components/ui/EventCard";
import { mapTicketmasterEvents } from "@/services/mappers/ticketmasterMapper";

export type CountryCode = 'IE' | 'GB' | 'FR' | 'ES' | 'DE' | 'NL';

export const fetchFestivalsByCountry = async (countryCode: CountryCode): Promise<EventCardProps[]> => {
  try {
    const data = await fetchFromTicketmasterApi('events.json', {
      keyword: 'festival',
      locale: '*',
      countryCode,
      segmentName: 'music',
      size: '200' // Add size parameter to get more results
    });

    if (!data._embedded?.events) {
      console.warn(`No festivals found for country code: ${countryCode}`);
      return [];
    }

    return mapTicketmasterEvents(data._embedded.events);
  } catch (error) {
    console.error(`Error fetching festivals for country ${countryCode}:`, error);
    throw error;
  }
};
