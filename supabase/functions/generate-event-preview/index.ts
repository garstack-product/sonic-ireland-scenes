
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching content from URL:', url);

    // Fetch the webpage content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract content from HTML
    const title = extractTitleFromHTML(html);
    const eventInfo = extractEventInfoFromHTML(html);
    const images = extractImagesFromHTML(html, url);
    
    console.log('Extracted title:', title);
    console.log('Found images:', images.length);

    // Generate a comprehensive preview (500+ words)
    const preview = generateComprehensivePreview(title, eventInfo, url);

    console.log('Generated preview length:', preview.length);

    return new Response(
      JSON.stringify({
        title,
        preview,
        images: images.slice(0, 5), // Limit to 5 images
        originalUrl: url
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-event-preview function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractTitleFromHTML(html: string): string {
  // Try title tag first
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1].trim()) {
    return titleMatch[1].trim();
  }
  
  // Try meta title
  const metaTitleMatch = html.match(/<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);
  if (metaTitleMatch) {
    return metaTitleMatch[1].trim();
  }
  
  // Try h1 tags
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].replace(/<[^>]+>/g, '').trim();
  }
  
  return 'Event Preview';
}

function extractEventInfoFromHTML(html: string): {
  description: string;
  date: string;
  venue: string;
  artist: string;
  genre: string;
  ticketInfo: string;
} {
  // Remove script and style elements
  let cleanHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleanHtml = cleanHtml.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Extract meta description
  const metaDescMatch = cleanHtml.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);
  const ogDescMatch = cleanHtml.match(/<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);
  
  const description = metaDescMatch?.[1] || ogDescMatch?.[1] || '';
  
  // Try to find date patterns
  const datePatterns = [
    /\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\b/,
    /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{2,4})\b/i,
    /\b((?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b/i
  ];
  
  let date = '';
  for (const pattern of datePatterns) {
    const match = cleanHtml.match(pattern);
    if (match) {
      date = match[1];
      break;
    }
  }
  
  // Try to find venue information
  const venueKeywords = ['venue', 'location', 'address', 'where'];
  let venue = '';
  
  for (const keyword of venueKeywords) {
    const venuePattern = new RegExp(`${keyword}[^>]*>([^<]+)<`, 'i');
    const match = cleanHtml.match(venuePattern);
    if (match && match[1].trim().length > 3) {
      venue = match[1].trim();
      break;
    }
  }
  
  // Try to find artist/performer information from headings
  const headingMatches = cleanHtml.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi);
  let artist = '';
  
  if (headingMatches) {
    for (const heading of headingMatches.slice(0, 3)) {
      const text = heading.replace(/<[^>]+>/g, '').trim();
      if (text.length > 5 && text.length < 50 && !text.toLowerCase().includes('event')) {
        artist = text;
        break;
      }
    }
  }

  // Extract genre information
  const genreKeywords = ['rock', 'pop', 'electronic', 'indie', 'folk', 'jazz', 'blues', 'classical', 'hip-hop', 'rap', 'country', 'metal'];
  let genre = '';
  for (const g of genreKeywords) {
    if (cleanHtml.toLowerCase().includes(g)) {
      genre = g.charAt(0).toUpperCase() + g.slice(1);
      break;
    }
  }

  // Extract ticket information
  const ticketPatterns = [
    /ticket[s]?[^.]*\$?[\d]+/i,
    /price[s]?[^.]*\$?[\d]+/i,
    /admission[^.]*\$?[\d]+/i
  ];
  let ticketInfo = '';
  for (const pattern of ticketPatterns) {
    const match = cleanHtml.match(pattern);
    if (match) {
      ticketInfo = match[0];
      break;
    }
  }
  
  return { description, date, venue, artist, genre, ticketInfo };
}

function generateComprehensivePreview(title: string, eventInfo: any, url: string): string {
  const { description, date, venue, artist, genre, ticketInfo } = eventInfo;
  
  let preview = '';
  
  // Opening hook (50-75 words)
  if (artist && artist !== title) {
    preview += `Prepare yourself for an extraordinary musical journey as ${artist} takes the stage in what promises to be one of the most anticipated live performances of the season. `;
  } else if (title) {
    preview += `Mark your calendars and clear your schedule because ${title} is set to deliver an unforgettable experience that will resonate with music lovers long after the final note has been played. `;
  }
  
  // Event details and atmosphere (100-150 words)
  if (date) {
    preview += `Scheduled for ${date}, this remarkable event represents more than just a concert – it's a celebration of musical artistry and community spirit. `;
  }
  
  if (venue) {
    preview += `The chosen venue, ${venue}, provides the perfect backdrop for this spectacular gathering, offering an intimate yet energetic atmosphere where every seat promises an optimal experience. `;
  } else {
    preview += `The carefully selected venue ensures that every attendee will be immersed in an acoustic environment designed to showcase the full range and power of live musical performance. `;
  }
  
  // Musical genre and style (75-100 words)
  if (genre) {
    preview += `As a ${genre.toLowerCase()} event, audiences can expect a dynamic blend of rhythm, melody, and raw energy that defines this beloved musical style. `;
  }
  preview += `The performance will feature a carefully curated setlist that balances crowd favorites with surprising deep cuts, creating moments of collective singing alongside intimate musical discoveries. Whether you're a longtime devotee or curious newcomer, the show promises to deliver both familiar comfort and exciting musical exploration. `;
  
  // Description integration (50-75 words)
  if (description) {
    const enhancedDesc = description.length > 150 ? description.substring(0, 150) + '...' : description;
    preview += `Event organizers describe the experience as follows: "${enhancedDesc}" This gives you just a taste of what's in store for attendees lucky enough to secure their spot at this must-see event. `;
  }
  
  // Community and experience (100-125 words)
  preview += `Beyond the music itself, this event represents an opportunity to connect with fellow enthusiasts who share your passion for live entertainment. The shared experience of live music creates bonds that extend far beyond the venue walls, fostering a sense of community that enriches both the performance and your appreciation of the art form. `;
  
  preview += `From the moment you arrive until the final encore, every detail has been thoughtfully planned to ensure your complete enjoyment. Professional sound engineering, carefully designed lighting, and attention to crowd flow all contribute to an seamless experience that allows you to focus entirely on the music and atmosphere. `;
  
  // Practical information and urgency (75-100 words)
  if (ticketInfo) {
    preview += `${ticketInfo} represents exceptional value for an experience of this caliber. `;
  }
  
  preview += `Given the popularity of events of this nature and the limited capacity of the venue, we strongly encourage early ticket purchase to avoid disappointment. Popular shows frequently sell out well in advance, particularly when word spreads about the quality of both the performers and the venue experience. `;
  
  // Final call to action (50-75 words)
  preview += `Don't let this opportunity slip away – secure your tickets now and prepare for an evening that will remind you why live music remains one of life's most powerful and transformative experiences. Whether attending solo or with friends, you'll leave with memories that last a lifetime and quite possibly a new appreciation for the magic that happens when talented artists connect with engaged audiences in real time.`;
  
  return preview;
}

function extractImagesFromHTML(html: string, baseUrl: string): string[] {
  const images: string[] = [];
  
  // Extract img src attributes
  const imgMatches = html.matchAll(/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/gi);
  for (const match of imgMatches) {
    const src = match[1];
    if (src && !src.startsWith('data:')) {
      images.push(resolveUrl(src, baseUrl));
    }
  }
  
  // Extract og:image meta tags
  const ogImageMatches = html.matchAll(/<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/gi);
  for (const match of ogImageMatches) {
    const src = match[1];
    if (src) {
      images.push(resolveUrl(src, baseUrl));
    }
  }
  
  // Filter out common icons and small images
  return images.filter(img => {
    const lowercaseImg = img.toLowerCase();
    return !lowercaseImg.includes('icon') && 
           !lowercaseImg.includes('logo') && 
           !lowercaseImg.includes('favicon') &&
           !lowercaseImg.includes('sprite');
  });
}

function resolveUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  
  if (url.startsWith('/')) {
    const urlObj = new URL(baseUrl);
    return `${urlObj.protocol}//${urlObj.host}${url}`;
  }
  
  return new URL(url, baseUrl).toString();
}
