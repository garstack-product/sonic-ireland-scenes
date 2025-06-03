
import { supabase } from "@/integrations/supabase/client";
import { EventCardProps } from "@/components/ui/EventCard";

export const fetchFutureEventsFromDatabase = async (): Promise<EventCardProps[]> => {
  // Get current date for filtering future events only
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Fetch events directly from database instead of API to ensure we have the correct flags
  const { data: eventsData, error } = await supabase
    .from('events')
    .select('*')
    .gte('raw_date', today.toISOString()) // Only get future events
    .order('raw_date', { ascending: true });
  
  if (error) {
    throw error;
  }
  
  if (!eventsData) {
    return [];
  }
  
  console.log('Got', eventsData.length, 'future events from database');
  
  // Map database events to EventCardProps format and ensure flags are included
  return eventsData.map(event => ({
    id: event.id,
    title: event.title,
    artist: event.artist || '',
    venue: event.venue || '',
    date: event.date || '',
    time: event.time || '',
    imageUrl: event.image_url || '/placeholder.svg',
    type: (event.type as 'concert' | 'festival') || 'concert',
    category: 'listing' as const,
    genre: event.genre || undefined,
    subgenre: event.subgenre || undefined,
    price: event.price || undefined,
    ticketUrl: event.ticket_url || undefined,
    rawDate: event.raw_date || undefined,
    onSaleDate: event.on_sale_date || null,
    // Include the flags that are needed for the admin dashboard
    is_featured: event.is_featured || false,
    is_hidden: event.is_hidden || false,
    is_festival: event.is_festival || false
  }));
};

export const updateEventFlags = async (
  allEventIds: string[],
  featuredEvents: string[],
  hiddenEvents: string[],
  festivalEvents: string[]
) => {
  console.log('=== UPDATING EVENT FLAGS IN DATABASE ===');
  console.log('All event IDs being managed:', allEventIds);
  console.log('Featured events to set:', featuredEvents);
  console.log('Hidden events to set:', hiddenEvents);
  console.log('Festival events to set:', festivalEvents);
  
  try {
    // Create update promises for each event with their specific flags
    const updatePromises = allEventIds.map(async (eventId) => {
      const isFeatured = featuredEvents.includes(eventId);
      const isHidden = hiddenEvents.includes(eventId);
      const isFestival = festivalEvents.includes(eventId);
      
      console.log(`Updating event ${eventId}:`, {
        is_featured: isFeatured,
        is_hidden: isHidden,
        is_festival: isFestival
      });
      
      const { error } = await supabase
        .from('events')
        .update({
          is_featured: isFeatured,
          is_hidden: isHidden,
          is_festival: isFestival
        })
        .eq('id', eventId);
      
      if (error) {
        console.error(`Failed to update event ${eventId}:`, error);
        throw error;
      }
      
      console.log(`✅ Successfully updated event ${eventId}`);
      return eventId;
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    console.log('=== ALL EVENT FLAGS UPDATED SUCCESSFULLY ===');
    
    // Verify the updates by checking a few events
    console.log('Verifying updates...');
    if (featuredEvents.length > 0) {
      const { data: verifyData, error: verifyError } = await supabase
        .from('events')
        .select('id, is_featured, is_hidden, is_festival')
        .in('id', featuredEvents.slice(0, 3)); // Check first 3 featured events
      
      if (!verifyError && verifyData) {
        console.log('Verification - Sample featured events in DB:', verifyData);
      }
    }
    
  } catch (error) {
    console.error('❌ Error updating event flags:', error);
    throw error;
  }
};

export const fetchCacheMetadata = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('cache_metadata')
      .select('last_updated, record_count')
      .eq('id', 'ticketmaster')
      .single();
    
    if (error) {
      console.error("Error fetching last sync info:", error);
      return "No sync information available";
    }
    
    if (data) {
      const lastSyncDate = new Date(data.last_updated);
      const formattedDate = lastSyncDate.toLocaleString();
      return `Last synced: ${formattedDate} (${data.record_count} events)`;
    } else {
      return "No sync information available";
    }
  } catch (error) {
    console.error("Error fetching sync info:", error);
    return "Error fetching sync info";
  }
};
