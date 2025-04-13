
import { useState, useEffect } from "react";
import { Venue } from "@/types/venue";
import { fetchAllEvents } from "@/services/api";
import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      
      // First try to get venues from database with proper coordinates
      const { data: dbVenues, error } = await supabase
        .from('venues')
        .select('*');
      
      if (error) {
        console.error("Error fetching venues:", error);
        fallbackToEventData(eventData);
        return;
      }
      
      if (!dbVenues || dbVenues.length === 0) {
        console.log("No venues found in database, using event data");
        fallbackToEventData(eventData);
        return;
      }
      
      // Create venue objects from database data
      const venueMap = new Map<string, Venue>();
      
      // First populate the venue map with database venues
      dbVenues.forEach(venue => {
        if (venue.name && venue.latitude && venue.longitude) {
          venueMap.set(venue.id, {
            id: venue.id,
            name: venue.name,
            city: venue.city || 'Unknown',
            latitude: parseFloat(venue.latitude),
            longitude: parseFloat(venue.longitude),
            eventCount: 0,
            events: []
          });
        }
      });
      
      // Now add events to each venue
      eventData.forEach(event => {
        // Try to find venue by ID
        const venueId = event.venue_id;
        if (venueId && venueMap.has(venueId)) {
          const venue = venueMap.get(venueId)!;
          venue.events.push(event);
          venue.eventCount += 1;
        } else {
          // No venue ID or not found - use name matching
          const venueName = event.venue.split(',')[0].trim();
          
          // Try to find by name (not perfect but best effort)
          let foundVenue = false;
          for (const [id, venue] of venueMap.entries()) {
            if (venue.name.toLowerCase() === venueName.toLowerCase()) {
              venue.events.push(event);
              venue.eventCount += 1;
              foundVenue = true;
              break;
            }
          }
          
          // If no venue match, create a placeholder with default coords
          if (!foundVenue) {
            const cityName = event.venue.includes(',') ? event.venue.split(',')[1].trim() : 'Dublin';
            const newVenueId = `venue-${venueName.toLowerCase().replace(/\s+/g, '-')}`;
            
            if (!venueMap.has(newVenueId)) {
              venueMap.set(newVenueId, {
                id: newVenueId,
                name: venueName,
                city: cityName,
                latitude: 53.3498, // Default Dublin
                longitude: -6.2603,
                eventCount: 0,
                events: []
              });
            }
            
            const newVenue = venueMap.get(newVenueId)!;
            newVenue.events.push(event);
            newVenue.eventCount += 1;
          }
        }
      });
      
      // Convert map to array and filter out venues with no events
      const venuesArray = Array.from(venueMap.values())
        .filter(venue => venue.eventCount > 0);
      
      setVenues(venuesArray);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading event data:", error);
      toast.error("Failed to load event data");
      setIsLoading(false);
    }
  };
  
  const fallbackToEventData = (eventData: EventCardProps[]) => {
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
