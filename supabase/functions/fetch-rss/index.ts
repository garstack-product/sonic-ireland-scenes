
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
          
          // Clean unicode characters and HTML entities
          title = cleanText(title);
          description = cleanText(description);
          
          // Extract image from description
          const imageMatch = description.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
          const imageUrl = imageMatch ? imageMatch[1] : null;
          
          // Clean description of HTML tags for excerpt
          const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 200);
          
          if (!title || !link) continue;
          
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
