import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6';

// Supabase client
const supabaseUrl = 'https://eckohtoprkgolyjdiown.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Ticketmaster API key
const ticketmasterApiKey = 'ARUuNeTjV7x8sxiLzbu94m0GOF5HwI3n';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// List of genres/subgenres to filter out (sports)
const SPORTS_GENRES = [
  'Rugby',
  'GAA',
  'Football',
  'Sports',
  'Basketball',
  'Soccer',
  'Baseball',
  'Hockey',
  'Cricket',
];

// Handle CORS preflight requests
async function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

// Check if an event is a sports event
function isSportsEvent(event: any): boolean {
  const genre = event.classifications?.[0]?.genre?.name || "";
  const subgenre = event.classifications?.[0]?.subGenre?.name || "";
  const segment = event.classifications?.[0]?.segment?.name || "";
  
  return SPORTS_GENRES.some(sportGenre => 
    genre.includes(sportGenre) || 
    subgenre.includes(sportGenre) || 
    segment.includes(sportGenre) ||
    segment === "Sports"
  );
}

// Helper function to format dates
function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper function to format times
function formatTime(timeStr: string) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Main function to fetch and update events
async function fetchTicketmasterEvents() {
  console.log("Starting Ticketmaster sync...");
  
  // Check if update is needed (24 hour cache)
  try {
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
      
      // Return existing data count
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
  } catch (error) {
    console.error("Error checking cache:", error);
    // Continue with update as fallback
  }

  try {
    // Fetch events from Ticketmaster API for both countries
    const fetchAllPages = async (countryCode: string) => {
      let allEvents = [];
      let page = 0;
      const pageSize = 200;
      let totalPages = 1;
      
      do {
        console.log(`Fetching page ${page + 1} of events for ${countryCode}...`);
        const response = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?` +
          `countryCode=${countryCode}` +
          `&size=${pageSize}&page=${page}` +
          `&segmentName=Music` +
          `&keyword=festival` +
          `&apikey=${ticketmasterApiKey}`
        );
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data._embedded || !data._embedded.events) {
          console.warn(`No events found on page ${page} for ${countryCode}`);
          break;
        }
        
        // Add events from this page
        allEvents = [...allEvents, ...data._embedded.events.map((event: any) => ({
          ...event,
          _countryCode: countryCode
        }))];
        
        page++;
        totalPages = data.page?.totalPages || 1;
        
        if (page < totalPages) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } while (page < totalPages && page < 5);
      
      return allEvents;
    };
    
    // Fetch events for both countries
    const ieEvents = await fetchAllPages('IE');
    const ukEvents = await fetchAllPages('GB');
    const allEvents = [...ieEvents, ...ukEvents];
    
    // Filter out sports events
    const filteredEvents = allEvents.filter(event => !isSportsEvent(event));
    console.log(`Found ${filteredEvents.length} non-sports events from Ticketmaster`);
    
    // Process venues first to avoid foreign key issues
    const venues = new Map();
    for (const event of filteredEvents) {
      if (event._embedded?.venues?.[0]) {
        const venue = event._embedded.venues[0];
        if (!venue.name) {
          console.log("Found venue without name:", venue);
          continue; // Skip venues without names to avoid DB constraint errors
        }
        venues.set(venue.id, {
          id: venue.id,
          name: venue.name,
          city: venue.city?.name,
          address: venue.address?.line1,
          postal_code: venue.postalCode,
          state: venue.state?.name,
          country: venue.country?.name,
          latitude: venue.location?.latitude,
          longitude: venue.location?.longitude,
          url: venue.url,
          image_url: venue.images?.[0]?.url,
          raw_data: venue
        });
      }
    }
    
    console.log(`Processing ${venues.size} unique venues`);
    
    // Insert venues into database
    if (venues.size > 0) {
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
    
    // Process events with country information
    const processedEvents = filteredEvents.map(event => {
      // Extract venue info
      const venue = event._embedded?.venues?.[0];
      const venueId = venue?.id;
      const venueName = venue?.name || "";
      const city = venue?.city?.name || "";
      const venueFull = city ? `${venueName}, ${city}` : venueName;
      
      // Get best image (prefer large 16:9 ratio)
      const imageUrl = 
        event.images?.find((img: any) => img.ratio === "16_9" && img.width > 500)?.url ||
        event.images?.find((img: any) => img.width > 500)?.url ||
        event.images?.[0]?.url ||
        "/placeholder.svg";
      
      // Get date and time
      const startDate = event.dates?.start?.localDate;
      const startTime = event.dates?.start?.localTime;
      const formattedDate = formatDate(startDate);
      const formattedTime = formatTime(startTime);
      
      // Get genre info
      const genre = event.classifications?.[0]?.genre?.name;
      const subgenre = event.classifications?.[0]?.subGenre?.name;
      
      // Get price info - now extracting both min and max price
      const minPrice = event.priceRanges?.[0]?.min;
      const maxPrice = event.priceRanges?.[0]?.max;
      
      // Try to extract artist name
      let artistName = "";
      if (event._embedded?.attractions?.[0]?.name) {
        artistName = event._embedded.attractions[0].name;
      } else if (event.name && event.name.includes(":")) {
        artistName = event.name.split(":")[0].trim();
      } else {
        artistName = event.name;
      }
      
      // Compute event type
      let eventType = "concert";
      // Determine if this is a festival
      const isFestival = event.name?.toLowerCase().includes("festival") || 
          event.classifications?.[0]?.subGenre?.name?.toLowerCase().includes("festival");
          
      if (isFestival) {
        eventType = "festival";
      }
      
      // Create properly formatted datetime string for raw_date
      const rawDateTime = event.dates?.start?.dateTime || event.dates?.start?.localDate;
      const rawDate = rawDateTime ? new Date(rawDateTime).toISOString() : null;
      
      // Create properly formatted datetime string for on_sale_date
      const onSaleDateTime = event.sales?.public?.startDateTime;
      const onSaleDate = onSaleDateTime ? new Date(onSaleDateTime).toISOString() : null;
      
      // Extract artist links from attractions or other sources
      const artistLinks = event._embedded?.attractions?.[0]?.externalLinks || {};
      const processedLinks = {
        homepage: artistLinks.homepage?.[0]?.url,
        facebook: artistLinks.facebook?.[0]?.url,
        instagram: artistLinks.instagram?.[0]?.url,
        twitter: artistLinks.twitter?.[0]?.url,
        spotify: artistLinks.spotify?.[0]?.url,
        itunes: artistLinks.itunes?.[0]?.url,
        musicbrainz: null,
        lastfm: null,
        wiki: null
      };

      return {
        id: event.id,
        title: event.name,
        artist: artistName,
        venue: venueFull,
        venue_id: venueId,
        date: formattedDate,
        time: formattedTime,
        raw_date: rawDate,
        on_sale_date: onSaleDate,
        image_url: imageUrl,
        ticket_url: event.url,
        genre: genre !== "Undefined" ? genre : null,
        subgenre: subgenre !== "Undefined" ? subgenre : null,
        price: minPrice || null,
        // Include raw price ranges in the raw_data field
        raw_data: {
          ...event,
          priceRanges: event.priceRanges // Ensure the price ranges are stored in raw_data
        },
        type: eventType,
        description: event.info || null,
        artist_links: processedLinks,
        country: event._countryCode === 'GB' ? 'UK' : 'Ireland',
        is_festival: isFestival
      };
    });
    
    // Insert events into database
    console.log(`Inserting ${processedEvents.length} events into database...`);
    const { error: eventsError } = await supabase
      .from('events')
      .upsert(processedEvents, { 
        onConflict: 'id',
        ignoreDuplicates: false
      });
    
    if (eventsError) {
      console.error("Error inserting events:", eventsError);
      throw eventsError;
    }
    
    // Update cache metadata
    await supabase.rpc(
      'update_cache_metadata',
      { 
        cache_id: 'ticketmaster', 
        source: 'ticketmaster',
        count: processedEvents.length,
        status: 'success'
      }
    );
    
    return { 
      refreshed: true, 
      count: processedEvents.length,
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
