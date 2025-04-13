
import { supabase } from "@/integrations/supabase/client";
import { EventCardProps } from "@/components/ui/EventCard";

// Fetch events from Supabase database
export const fetchEventsFromDatabase = async (): Promise<EventCardProps[] | null> => {
  try {
    console.log("Checking database for events...");
    
    // Query events from Supabase
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('raw_date', { ascending: true });
    
    if (error) {
      console.error("Error fetching events from database:", error);
      return null;
    }
    
    if (!events || events.length === 0) {
      console.log("No events found in database");
      return null;
    }
    
    console.log(`Found ${events.length} events in database`);
    
    // Map database events to EventCardProps format
    return events.map(event => ({
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
      onSaleDate: event.on_sale_date || null
    }));
  } catch (error) {
    console.error("Database fetch failed:", error);
    return null;
  }
};

// Fetch a single event from the database
export const fetchEventFromDatabase = async (eventId: string): Promise<EventCardProps | null> => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
      
    if (error || !event) {
      return null;
    }
    
    return {
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
      onSaleDate: event.on_sale_date || null
    };
  } catch (error) {
    console.error("Error fetching event from database:", error);
    return null;
  }
};

// Trigger an event sync through the Edge Function
export const triggerEventSync = async (): Promise<{count: number, refreshed: boolean} | null> => {
  try {
    console.log("Initiating Ticketmaster sync...");
    const syncResponse = await fetch('https://eckohtoprkgolyjdiown.supabase.co/functions/v1/ticketmaster-sync');
    const syncResult = await syncResponse.json();
    console.log("Sync result:", syncResult);
    
    if (syncResult.error) {
      throw new Error(syncResult.error);
    }
    
    return {
      count: syncResult.count || 0,
      refreshed: syncResult.refreshed || false
    };
  } catch (syncError) {
    console.error("Error during sync:", syncError);
    return null;
  }
};
