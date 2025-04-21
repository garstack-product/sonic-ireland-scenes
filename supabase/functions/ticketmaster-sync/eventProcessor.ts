import { CountryConfig, ProcessedEvent, VenueData, ArtistLinks } from './types.ts';
import { formatDate, formatTime } from './utils.ts';

// Ticketmaster API key
const ticketmasterApiKey = 'ARUuNeTjV7x8sxiLzbu94m0GOF5HwI3n';

// Fetch events for a specific country
export async function fetchEventsForCountry(country: CountryConfig) {
  let allEvents = [];
  let page = 0;
  const pageSize = 200;
  let totalPages = 1;
  
  do {
    console.log(`Fetching page ${page + 1} of events for ${country.name}...`);
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?` +
      `countryCode=${country.code}` +
      `&size=${pageSize}&page=${page}` +
      `&segmentName=Music` +
      `&keyword=festival` +
      `&locale=*` +
      `&apikey=${ticketmasterApiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data._embedded || !data._embedded.events) {
      console.warn(`No events found on page ${page} for ${country.name}`);
      break;
    }
    
    allEvents = [...allEvents, ...data._embedded.events.map((event: any) => ({
      ...event,
      _countryName: country.name
    }))];
    
    page++;
    totalPages = data.page?.totalPages || 1;
    
    if (page < totalPages) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } while (page < totalPages && page < 5);
  
  return allEvents;
}

// Process raw events into our format
export function processEvents(events: any[]): { events: ProcessedEvent[], venues: Map<string, VenueData> } {
  const venues = new Map<string, VenueData>();
  
  // First pass: collect unique venues
  events.forEach(event => {
    if (event._embedded?.venues?.[0]) {
      const venue = event._embedded.venues[0];
      if (!venue.name) {
        console.log("Found venue without name:", venue);
        return;
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
  });
  
  // Second pass: process events
  const processedEvents = events.map(event => {
    const venue = event._embedded?.venues?.[0];
    const venueId = venue?.id;
    const venueName = venue?.name || "";
    const city = venue?.city?.name || "";
    const venueFull = city ? `${venueName}, ${city}` : venueName;
    
    const imageUrl = 
      event.images?.find((img: any) => img.ratio === "16_9" && img.width > 500)?.url ||
      event.images?.find((img: any) => img.width > 500)?.url ||
      event.images?.[0]?.url ||
      "/placeholder.svg";
    
    // Get artist info and links
    let artistName = "";
    if (event._embedded?.attractions?.[0]?.name) {
      artistName = event._embedded.attractions[0].name;
    } else if (event.name && event.name.includes(":")) {
      artistName = event.name.split(":")[0].trim();
    } else {
      artistName = event.name;
    }
    
    const artistLinks = event._embedded?.attractions?.[0]?.externalLinks || {};
    const processedLinks: ArtistLinks = {
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
    
    const isFestival = true; // All events are festivals due to our API query
    
    // Get price ranges
    const minPrice = event.priceRanges?.[0]?.min || null;
    const maxPrice = event.priceRanges?.[0]?.max || null;
    
    return {
      id: event.id,
      title: event.name,
      artist: artistName,
      venue: venueFull,
      venue_id: venueId,
      date: formatDate(event.dates?.start?.localDate),
      time: formatTime(event.dates?.start?.localTime),
      raw_date: new Date(event.dates?.start?.dateTime || event.dates?.start?.localDate).toISOString(),
      on_sale_date: event.sales?.public?.startDateTime ? new Date(event.sales.public.startDateTime).toISOString() : null,
      image_url: imageUrl,
      ticket_url: event.url,
      genre: event.classifications?.[0]?.genre?.name !== "Undefined" ? event.classifications?.[0]?.genre?.name : null,
      subgenre: event.classifications?.[0]?.subGenre?.name !== "Undefined" ? event.classifications?.[0]?.subGenre?.name : null,
      price: minPrice,
      start_price: minPrice,
      max_price: maxPrice,
      raw_data: event,
      type: 'festival',
      description: event.info || null,
      artist_links: processedLinks,
      country: event._countryName,
      is_festival: isFestival
    };
  });
  
  return { events: processedEvents, venues };
}
