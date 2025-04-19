
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
  
  const { error: eventsError } = await supabase
    .from('events')
    .upsert(events, { 
      onConflict: 'id',
      ignoreDuplicates: false
    });
  
  if (eventsError) {
    console.error("Error inserting events:", eventsError);
    throw eventsError;
  }
}
