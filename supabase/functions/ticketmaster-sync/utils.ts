// Define CORS headers for browser requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper for handling CORS preflight requests
export async function handleCors(req: Request): Promise<Response | null> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  // Otherwise, just add the CORS headers to the response when it's sent
  return null;
}

// Format date into human-readable form
export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

// Format time into 12-hour format
export function formatTime(timeStr: string | undefined): string {
  if (!timeStr) return '';
  
  try {
    // Handle ISO time format
    if (timeStr.includes('T')) {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    
    // Handle just the time part (HH:MM:SS)
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (e) {
    return timeStr;
  }
}

// Check if an event is a sports event
export function isSportsEvent(event: any): boolean {
  const segment = event.classifications?.[0]?.segment?.name;
  const genre = event.classifications?.[0]?.genre?.name;
  
  const sportSegments = ['Sports', 'Sporting Events'];
  const sportGenres = ['Rugby', 'Soccer', 'GAA', 'Football', 'Racing', 'Athletics'];
  
  return (
    sportSegments.includes(segment) || 
    sportGenres.includes(genre) ||
    (event.title && (
      event.title.includes('Rugby') ||
      event.title.includes('Football') ||
      event.title.includes('Racing') ||
      event.title.includes('Athletics')
    ))
  );
}
