
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract text content and images from HTML
    const textContent = extractTextFromHTML(html);
    const images = extractImagesFromHTML(html, url);
    const title = extractTitleFromHTML(html);
    
    console.log('Extracted content length:', textContent.length);
    console.log('Found images:', images.length);

    // Generate AI preview using OpenAI
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a music journalist who creates engaging event previews. Generate a compelling 150-250 word preview for concerts, festivals, or music events based on the provided content. Focus on the artist(s), venue, date, what makes this event special, and why people should attend. Write in an engaging, informative style suitable for music fans.'
          },
          {
            role: 'user',
            content: `Create an event preview based on this content from ${url}:\n\nTitle: ${title}\n\nContent: ${textContent.substring(0, 3000)}`
          }
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const preview = aiData.choices[0].message.content;

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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractTextFromHTML(html: string): string {
  // Remove script and style elements
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

function extractTitleFromHTML(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  
  // Try meta title
  const metaTitleMatch = html.match(/<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);
  if (metaTitleMatch) {
    return metaTitleMatch[1].trim();
  }
  
  return 'Event Preview';
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
