
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
  
  // Map database events to EventCardProps format
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
    is_featured: event.is_featured,
    is_hidden: event.is_hidden
  }));
};

export const updateEventFlags = async (
  allEventIds: string[],
  featuredEvents: string[],
  hiddenEvents: string[],
  festivalEvents: string[]
) => {
  // First, reset all flags to false for all events we're managing
  const { error: resetError } = await supabase
    .from('events')
    .update({ 
      is_featured: false,
      is_hidden: false,
      is_festival: false
    })
    .in('id', allEventIds);
  
  if (resetError) {
    console.error('Error resetting event flags:', resetError);
    throw resetError;
  }
  
  // Then set the flags to true for the selected events
  const updates = [];
  
  if (featuredEvents.length > 0) {
    updates.push(
      supabase
        .from('events')
        .update({ is_featured: true })
        .in('id', featuredEvents)
    );
  }
  
  if (hiddenEvents.length > 0) {
    updates.push(
      supabase
        .from('events')
        .update({ is_hidden: true })
        .in('id', hiddenEvents)
    );
  }
  
  if (festivalEvents.length > 0) {
    updates.push(
      supabase
        .from('events')
        .update({ is_festival: true })
        .in('id', festivalEvents)
    );
  }
  
  // Execute all updates
  if (updates.length > 0) {
    const results = await Promise.all(updates);
    
    // Check for errors
    for (const result of results) {
      if (result.error) {
        console.error('Error updating event flags:', result.error);
        throw result.error;
      }
    }
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
