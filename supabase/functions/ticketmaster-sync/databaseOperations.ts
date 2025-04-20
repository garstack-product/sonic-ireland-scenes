
import { VenueData, ProcessedEvent } from './types.ts';

// Insert venues into database
export async function insertVenues(supabase: any, venues: Map<string, VenueData>) {
  if (venues.size === 0) return;
  
  console.log(`Processing ${venues.size} unique venues`);
  
  const { error: venuesError } = await supabase
    .from('venues')
    .upsert(Array.from(venues.values()), { 
      onConflict: 'id',
      ignoreDuplicates: false
    });
  
  if (venuesError) {
    console.error("Error inserting venues:", venuesError);
    throw venuesError;
  }
}

// Insert events into database
export async function insertEvents(supabase: any, events: ProcessedEvent[]) {
  console.log(`Inserting ${events.length} events into database...`);
  
  // Ensure dates are properly formatted as ISO strings
  const formattedEvents = events.map(event => {
    // Make sure raw_date is properly formatted
    if (event.raw_date && !(event.raw_date instanceof Date) && typeof event.raw_date !== 'string') {
      event.raw_date = new Date(event.raw_date).toISOString();
    }
    
    // Make sure on_sale_date is properly formatted
    if (event.on_sale_date && !(event.on_sale_date instanceof Date) && typeof event.on_sale_date !== 'string') {
      event.on_sale_date = new Date(event.on_sale_date).toISOString();
    }
    
    return event;
  });
  
  const { error: eventsError } = await supabase
    .from('events')
    .upsert(formattedEvents, { 
      onConflict: 'id',
      ignoreDuplicates: false
    });
  
  if (eventsError) {
    console.error("Error inserting events:", eventsError);
    throw eventsError;
  }
}
