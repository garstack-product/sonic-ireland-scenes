
import { useState, useEffect } from "react";
import { Venue } from "@/types/venue";
import { fetchAllEvents } from "@/services/api";
import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";

export const useVenues = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const eventData = await fetchAllEvents();
      setEvents(eventData);
      
      // Group events by venue and extract venue information
      const venuesMap = new Map<string, Venue>();
      
      eventData.forEach(event => {
        // Extract venue info from the event
        const venueName = event.venue.split(',')[0].trim();
        
        if (!venuesMap.has(venueName)) {
          // Create a new venue entry
          venuesMap.set(venueName, {
            id: `venue-${venueName.toLowerCase().replace(/\s+/g, '-')}`,
            name: venueName,
            city: event.venue.includes(',') ? event.venue.split(',')[1].trim() : 'Dublin',
            // We'll properly geocode these later
            latitude: 53.3498, // Default Dublin latitude
            longitude: -6.2603, // Default Dublin longitude
            eventCount: 0,
            events: []
          });
        }
        
        // Add event to the venue
        const venue = venuesMap.get(venueName)!;
        venue.events.push(event);
        venue.eventCount += 1;
      });
      
      // Convert map to array
      const venuesArray = Array.from(venuesMap.values());
      setVenues(venuesArray);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading event data:", error);
      toast.error("Failed to load event data");
      setIsLoading(false);
    }
  };

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowEvents(true);
  };

  const handleBackToVenues = () => {
    setShowEvents(false);
    setSelectedVenue(null);
  };

  return {
    events,
    venues,
    isLoading,
    selectedVenue,
    showEvents,
    handleVenueClick,
    handleBackToVenues,
    setSelectedVenue
  };
};
