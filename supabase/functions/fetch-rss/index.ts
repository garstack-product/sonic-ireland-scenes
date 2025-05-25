
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
        
        // Parse RSS XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Extract items
        const items = xmlDoc.getElementsByTagName('item');
        console.log(`Found ${items.length} items in ${feed.name}`);
        
        for (let i = 0; i < Math.min(items.length, 10); i++) { // Limit to 10 items per feed
          const item = items[i];
          
          const title = item.getElementsByTagName('title')[0]?.textContent || '';
          const link = item.getElementsByTagName('link')[0]?.textContent || '';
          const description = item.getElementsByTagName('description')[0]?.textContent || '';
          const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';
          const author = item.getElementsByTagName('author')[0]?.textContent || 
                        item.getElementsByTagName('dc:creator')[0]?.textContent || '';
          
          // Extract image from description or content
          const imageMatch = description.match(/<img[^>]+src="([^">]+)"/);
          const imageUrl = imageMatch ? imageMatch[1] : null;
          
          // Clean description of HTML tags for excerpt
          const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 200);
          
          // Check if item already exists
          const { data: existingItem } = await supabase
            .from('rss_items')
            .select('id')
            .eq('url', link)
            .eq('feed_id', feed.id)
            .single();
          
          if (!existingItem && title && link) {
            // Insert new RSS item
            const { error: insertError } = await supabase
              .from('rss_items')
              .insert({
                feed_id: feed.id,
                title: title.trim(),
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
