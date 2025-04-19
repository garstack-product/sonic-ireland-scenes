
// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
export async function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

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

// Check if an event is a sports event
export function isSportsEvent(event: any): boolean {
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
export function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper function to format times
export function formatTime(timeStr: string) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}
