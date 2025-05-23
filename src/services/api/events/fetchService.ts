
import { EventCardProps } from "@/components/ui/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { fetchTicketmasterEvents } from "../ticketmasterService";
import { toast } from "sonner";
import { checkCacheAge, triggerBackgroundSync } from "./cacheService";

// Fetch events from database
export const fetchAllEvents = async (): Promise<EventCardProps[]> => {
  try {
    console.log("Fetching events from Supabase database...");
    
    // Check if cache needs refresh
    const needsRefresh = await checkCacheAge();
    
    // Try to trigger a sync in the background if needed
    if (needsRefresh) {
      await triggerBackgroundSync();
    }
    
    // Query events from Supabase
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('raw_date', { ascending: true });
    
    if (error) {
      console.error("Error fetching events from database:", error);
      return fetchTicketmasterEvents();
    }

    if (!events || events.length === 0) {
      console.log("No events found in database, falling back to API");
      return fetchTicketmasterEvents();
    }
    
    console.log(`Got ${events.length} events from database`);
    
    // Map database events to EventCardProps format
    return events.map(event => {
      // Use the dedicated start_price and max_price fields
      let startPrice = event.start_price !== null ? event.start_price : event.price;
      let maxPrice = event.max_price !== null ? event.max_price : undefined;
      
      if ((event.raw_data && typeof event.raw_data === 'object') && (startPrice === null || startPrice === undefined)) {
        const rawData = event.raw_data as any;
        if (rawData.priceRanges && Array.isArray(rawData.priceRanges) && rawData.priceRanges.length > 0) {
          startPrice = rawData.priceRanges[0].min;
          maxPrice = rawData.priceRanges[0].max;
          if (maxPrice <= startPrice) {
            maxPrice = undefined;
          }
        }
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
        price: startPrice || undefined,
        maxPrice: maxPrice,
        ticketUrl: event.ticket_url || undefined,
        rawDate: event.raw_date || undefined,
        onSaleDate: event.on_sale_date || null,
        is_featured: event.is_featured,
        is_hidden: event.is_hidden,
        rawData: event.raw_data,
        start_price: startPrice,
        max_price: maxPrice
      };
    });
  } catch (error) {
    console.error("Error in fetchAllEvents:", error);
    toast.error("Error fetching events from database. Falling back to API.");
    return fetchTicketmasterEvents();
  }
};
