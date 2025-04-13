
// This file re-exports all API services for easier imports elsewhere
import { 
  fetchAllEvents, 
  fetchVenueEvents, 
  fetchJustAnnouncedEvents,
  fetchUpcomingEvents,
  fetchFeaturedEvents,
  syncTicketmasterEvents
} from './eventService';
import { fetchTicketmasterEvents, fetchTicketmasterEvent } from './ticketmasterService';
import { fetchArtistData } from './artistService';

export {
  // Event services
  fetchAllEvents,
  fetchVenueEvents,
  fetchJustAnnouncedEvents,
  fetchUpcomingEvents,
  fetchFeaturedEvents,
  syncTicketmasterEvents,
  
  // Original services we're re-exporting
  fetchTicketmasterEvents,
  fetchTicketmasterEvent,
  fetchArtistData
};
