
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  content?: string;
}

// Function to clean unicode characters and HTML entities
const cleanText = (text: string): string => {
  if (!text) return text;
  
  return text
    // Replace common HTML entities
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;/g, "...")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    // Remove other numeric HTML entities
    .replace(/&#\d+;/g, "")
    // Clean up extra whitespace
    .replace(/\s+/g, " ")
    .trim();
};

// Function to remove HTML tags from text
const stripHtmlTags = (text: string): string => {
  if (!text) return text;
  
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim();
};

// Enhanced function to extract image URL from RSS item
const extractImageUrl = (itemXml: string): string | null => {
  // Try multiple methods to find an image
  
  // 1. Look for media:content or media:thumbnail (Media RSS)
  const mediaContentMatch = itemXml.match(/<media:content[^>]+url=['"]([^'"]+)['"][^>]*type=['"]image\/[^'"]*['"][^>]*>|<media:content[^>]+type=['"]image\/[^'"]*['"][^>]*url=['"]([^'"]+)['"][^>]*>/i);
  if (mediaContentMatch) {
    return mediaContentMatch[1] || mediaContentMatch[2];
  }
  
  const mediaThumbnailMatch = itemXml.match(/<media:thumbnail[^>]+url=['"]([^'"]+)['"]/i);
  if (mediaThumbnailMatch) {
    return mediaThumbnailMatch[1];
  }
  
  // 2. Look for enclosure with image type
  const enclosureMatch = itemXml.match(/<enclosure[^>]+url=['"]([^'"]+)['"][^>]*type=['"]image\/[^'"]*['"][^>]*>|<enclosure[^>]+type=['"]image\/[^'"]*['"][^>]*url=['"]([^'"]+)['"][^>]*>/i);
  if (enclosureMatch) {
    return enclosureMatch[1] || enclosureMatch[2];
  }
  
  // 3. Look for image tag at item level
  const itemImageMatch = itemXml.match(/<image[^>]*>[\s\S]*?<url[^>]*>([^<]+)<\/url>[\s\S]*?<\/image>/i);
  if (itemImageMatch) {
    return itemImageMatch[1].trim();
  }
  
  // 4. Look for img tags in description or content (existing method, enhanced)
  const descriptionMatch = itemXml.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description[^>]*>([\s\S]*?)<\/description>/i);
  const contentMatch = itemXml.match(/<content:encoded[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>|<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i);
  
  const contentToSearch = (descriptionMatch?.[1] || descriptionMatch?.[2] || '') + ' ' + (contentMatch?.[1] || contentMatch?.[2] || '');
  
  if (contentToSearch) {
    // Look for img tags with src attribute
    const imgMatch = contentToSearch.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
    if (imgMatch) {
      const imgUrl = imgMatch[1];
      // Validate that it's likely an image URL
      if (imgUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i) || imgUrl.includes('image')) {
        return imgUrl;
      }
    }
    
    // Look for background-image in style attributes
    const bgImageMatch = contentToSearch.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/i);
    if (bgImageMatch) {
      return bgImageMatch[1];
    }
  }
  
  // 5. Look for Open Graph or Twitter card images in content
  const ogImageMatch = contentToSearch.match(/<meta[^>]+property=['"]og:image['"][^>]+content=['"]([^'"]+)['"]/i);
  if (ogImageMatch) {
    return ogImageMatch[1];
  }
  
  const twitterImageMatch = contentToSearch.match(/<meta[^>]+name=['"]twitter:image['"][^>]+content=['"]([^'"]+)['"]/i);
  if (twitterImageMatch) {
    return twitterImageMatch[1];
  }
  
  return null;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all active RSS feeds
    const { data: feeds, error: feedsError } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('is_active', true);

    if (feedsError) {
      console.error('Error fetching RSS feeds:', feedsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch RSS feeds' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing feeds:', feeds?.length);

    for (const feed of feeds || []) {
      try {
        console.log(`Fetching RSS feed: ${feed.name} - ${feed.url}`);
        
        // Fetch RSS feed
        const response = await fetch(feed.url);
        const xmlText = await response.text();
        
        // Use regex to parse RSS XML instead of DOMParser (not available in Deno)
        const itemMatches = xmlText.match(/<item[^>]*>([\s\S]*?)<\/item>/gi) || [];
        console.log(`Found ${itemMatches.length} items in ${feed.name}`);
        
        for (let i = 0; i < Math.min(itemMatches.length, 10); i++) {
          const itemXml = itemMatches[i];
          
          // Extract data using regex
          const titleMatch = itemXml.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i);
          const linkMatch = itemXml.match(/<link[^>]*>(.*?)<\/link>/i);
          const descriptionMatch = itemXml.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description[^>]*>([\s\S]*?)<\/description>/i);
          const pubDateMatch = itemXml.match(/<pubDate[^>]*>(.*?)<\/pubDate>/i);
          const authorMatch = itemXml.match(/<author[^>]*>(.*?)<\/author>|<dc:creator[^>]*>(.*?)<\/dc:creator>/i);
          
          let title = (titleMatch?.[1] || titleMatch?.[2] || '').trim();
          const link = (linkMatch?.[1] || '').trim();
          let description = (descriptionMatch?.[1] || descriptionMatch?.[2] || '').trim();
          const pubDate = (pubDateMatch?.[1] || '').trim();
          const author = (authorMatch?.[1] || authorMatch?.[2] || '').trim();
          
          // Clean unicode characters and HTML entities, then strip HTML tags
          title = stripHtmlTags(cleanText(title));
          description = stripHtmlTags(cleanText(description));
          
          // Extract image using enhanced method
          const imageUrl = extractImageUrl(itemXml);
          
          // Create clean excerpt from description
          const cleanDescription = description.substring(0, 200);
          
          if (!title || !link) continue;
          
          // Log image extraction for debugging
          if (imageUrl) {
            console.log(`Found image for "${title}": ${imageUrl}`);
          } else {
            console.log(`No image found for "${title}"`);
          }
          
          // Check if item already exists
          const { data: existingItem } = await supabase
            .from('rss_items')
            .select('id')
            .eq('url', link)
            .eq('feed_id', feed.id)
            .single();
          
          if (!existingItem) {
            // Insert new RSS item
            const { error: insertError } = await supabase
              .from('rss_items')
              .insert({
                feed_id: feed.id,
                title: title,
                content: description,
                excerpt: cleanDescription,
                author: author || null,
                published_date: pubDate ? new Date(pubDate).toISOString() : null,
                url: link,
                image_url: imageUrl,
                is_published: false,
                is_deleted: false
              });
            
            if (insertError) {
              console.error('Error inserting RSS item:', insertError);
            } else {
              console.log(`Inserted RSS item: ${title}`);
            }
          }
        }
        
        // Update last_fetched timestamp
        await supabase
          .from('rss_feeds')
          .update({ last_fetched: new Date().toISOString() })
          .eq('id', feed.id);
        
      } catch (error) {
        console.error(`Error processing feed ${feed.name}:`, error);
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'RSS feeds processed successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in RSS fetch function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
