
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6';
import { CountryConfig, ProcessedEvent, VenueData, ArtistLinks } from './types.ts';
import { handleCors, corsHeaders, isSportsEvent } from './utils.ts';
import { fetchEventsForCountry, processEvents } from './eventProcessor.ts';
import { insertVenues, insertEvents } from './databaseOperations.ts';

// Supabase client setup
const supabaseUrl = 'https://eckohtoprkgolyjdiown.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Define supported countries
const SUPPORTED_COUNTRIES: CountryConfig[] = [
  { code: 'IE', name: 'Ireland' },
  { code: 'GB', name: 'UK' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'DE', name: 'Germany' },
  { code: 'NL', name: 'Netherlands' }
];

// Main function to fetch and update events
async function fetchTicketmasterEvents() {
  console.log("Starting Ticketmaster sync...");
  
  try {
    // Check if update is needed (24 hour cache)
    const { data: shouldUpdate, error: updateError } = await supabase.rpc(
      'should_update_cache',
      { cache_id: 'ticketmaster', interval_hours: 24 }
    );
    
    if (updateError) {
      console.error("Error checking cache status:", updateError);
      throw updateError;
    }
    
    if (!shouldUpdate) {
      console.log("Cache is still fresh, skipping update");
      const { data: cacheMeta } = await supabase
        .from('cache_metadata')
        .select('record_count')
        .eq('id', 'ticketmaster')
        .single();
        
      return { 
        refreshed: false, 
        count: cacheMeta?.record_count || 0,
        message: "Using cached data"
      };
    }
    
    // Fetch events for all countries in parallel
    const countryEvents = await Promise.all(
      SUPPORTED_COUNTRIES.map(country => fetchEventsForCountry(country))
    );
    
    // Combine and process all events
    const allEvents = countryEvents.flat();
    const filteredEvents = allEvents.filter(event => !isSportsEvent(event));
    console.log(`Found ${filteredEvents.length} non-sports events from Ticketmaster`);
    
    // Process events and venues
    const { events, venues } = processEvents(filteredEvents);
    
    // Insert venues first
    await insertVenues(supabase, venues);
    
    // Then insert events
    await insertEvents(supabase, events);
    
    // Update cache metadata
    await supabase.rpc(
      'update_cache_metadata',
      { 
        cache_id: 'ticketmaster', 
        source: 'ticketmaster',
        count: events.length,
        status: 'success'
      }
    );
    
    return { 
      refreshed: true, 
      count: events.length,
      message: "Successfully refreshed events"
    };
    
  } catch (error) {
    console.error("Error syncing Ticketmaster data:", error);
    
    // Update cache metadata with error status
    await supabase.rpc(
      'update_cache_metadata',
      { 
        cache_id: 'ticketmaster', 
        source: 'ticketmaster',
        status: `error: ${error.message}`
      }
    );
    
    throw error;
  }
}

// Handle HTTP requests
Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = await handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Fetch and update events
    const result = await fetchTicketmasterEvents();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error in ticketmaster-sync function:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
