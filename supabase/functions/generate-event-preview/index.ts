
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

    // Generate a structured preview without AI
    const preview = generateStructuredPreview(title, eventInfo, url);

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
  
  return { description, date, venue, artist };
}

function generateStructuredPreview(title: string, eventInfo: any, url: string): string {
  const { description, date, venue, artist } = eventInfo;
  
  let preview = '';
  
  // Start with the title/artist
  if (artist && artist !== title) {
    preview += `Get ready for an exciting performance by ${artist}! `;
  } else if (title) {
    preview += `Don't miss ${title}! `;
  }
  
  // Add date if found
  if (date) {
    preview += `This event is scheduled for ${date}. `;
  }
  
  // Add venue if found
  if (venue) {
    preview += `The event will take place at ${venue}. `;
  }
  
  // Add description if available
  if (description) {
    const shortDesc = description.length > 100 ? description.substring(0, 100) + '...' : description;
    preview += `${shortDesc} `;
  }
  
  // Add a call to action
  preview += `This promises to be an unforgettable experience for music lovers. `;
  preview += `Don't wait too long to secure your tickets as popular events often sell out quickly. `;
  preview += `Check the official event page for the latest updates on tickets, timing, and any special announcements.`;
  
  // Ensure minimum length
  if (preview.length < 150) {
    preview += ` Whether you're a longtime fan or new to the scene, this event offers something special. `;
    preview += `Join fellow music enthusiasts for what's sure to be a memorable night of live entertainment.`;
  }
  
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
