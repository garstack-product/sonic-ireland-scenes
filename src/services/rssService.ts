
import { supabase } from "@/integrations/supabase/client";

interface RssFeed {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
  last_fetched?: string;
  created_at: string;
}

interface RssItem {
  id: string;
  feed_id?: string;
  title: string;
  content?: string;
  excerpt?: string;
  author?: string;
  published_date?: string;
  url?: string;
  image_url?: string;
  is_published: boolean;
  is_deleted: boolean;
  created_at: string;
  rss_feeds?: { name: string };
}

// Function to clean unicode characters from text
const cleanUnicodeText = (text: string): string => {
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

export const getRssFeeds = async (): Promise<RssFeed[]> => {
  const { data, error } = await supabase
    .from('rss_feeds')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching RSS feeds:', error);
    throw new Error('Failed to fetch RSS feeds');
  }
  
  return data || [];
};

export const getRssItems = async (searchTerm?: string, feedId?: string, month?: string): Promise<RssItem[]> => {
  let query = supabase
    .from('rss_items')
    .select(`
      *,
      rss_feeds!inner(name)
    `)
    .eq('is_deleted', false);

  // Apply search filter
  if (searchTerm && searchTerm.trim()) {
    query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
  }

  // Apply feed filter
  if (feedId && feedId !== 'all') {
    query = query.eq('feed_id', feedId);
  }

  // Apply month filter
  if (month && month !== 'all') {
    const year = new Date().getFullYear();
    const monthNum = parseInt(month);
    const startDate = new Date(year, monthNum - 1, 1).toISOString();
    const endDate = new Date(year, monthNum, 0).toISOString();
    query = query.gte('created_at', startDate).lte('created_at', endDate);
  }

  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching RSS items:', error);
    throw new Error('Failed to fetch RSS items');
  }
  
  // Clean unicode characters and HTML tags from the returned data
  const cleanedData = (data || []).map(item => ({
    ...item,
    title: stripHtmlTags(cleanUnicodeText(item.title)),
    content: item.content ? stripHtmlTags(cleanUnicodeText(item.content)) : item.content,
    excerpt: item.excerpt ? stripHtmlTags(cleanUnicodeText(item.excerpt)) : item.excerpt
  }));
  
  return cleanedData;
};

export const addRssFeed = async (name: string, url: string): Promise<RssFeed> => {
  const { data, error } = await supabase
    .from('rss_feeds')
    .insert([{ name, url, is_active: true }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding RSS feed:', error);
    throw new Error('Failed to add RSS feed');
  }
  
  return data;
};

export const toggleFeedActive = async (feedId: string, isActive: boolean): Promise<void> => {
  const { error } = await supabase
    .from('rss_feeds')
    .update({ is_active: isActive })
    .eq('id', feedId);
  
  if (error) {
    console.error('Error toggling feed active status:', error);
    throw new Error('Failed to update feed status');
  }
};

export const publishRssItem = async (itemId: string): Promise<void> => {
  console.log('Publishing RSS item:', itemId);
  
  // First get the RSS item
  const { data: rssItem, error: fetchError } = await supabase
    .from('rss_items')
    .select('*')
    .eq('id', itemId)
    .single();

  if (fetchError || !rssItem) {
    console.error('Error fetching RSS item:', fetchError);
    throw new Error('Failed to fetch RSS item');
  }

  console.log('RSS item data:', rssItem);

  // Clean the content before publishing and remove HTML tags
  const cleanTitle = stripHtmlTags(cleanUnicodeText(rssItem.title));
  const cleanContent = rssItem.content ? stripHtmlTags(cleanUnicodeText(rssItem.content)) : '';
  const cleanExcerpt = rssItem.excerpt ? stripHtmlTags(cleanUnicodeText(rssItem.excerpt)) : '';

  // Insert into news_items table with the original URL
  const { error: newsError } = await supabase
    .from('news_items')
    .insert([{
      title: cleanTitle,
      content: cleanContent || cleanExcerpt || 'No content available',
      excerpt: cleanExcerpt,
      author: rssItem.author || 'RSS Feed',
      date: rssItem.published_date || new Date().toISOString(),
      category: 'News',
      image_url: rssItem.image_url,
      tags: ['RSS Feed'],
      url: rssItem.url
    }]);

  if (newsError) {
    console.error('Error publishing to news:', newsError);
    throw new Error('Failed to publish to news');
  }

  console.log('Successfully published to news_items');

  // Mark RSS item as published
  const { error: updateError } = await supabase
    .from('rss_items')
    .update({ is_published: true })
    .eq('id', itemId);
  
  if (updateError) {
    console.error('Error updating RSS item status:', updateError);
    throw new Error('Failed to update RSS item status');
  }

  console.log('Successfully marked RSS item as published');
};

export const deleteRssItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from('rss_items')
    .update({ is_deleted: true })
    .eq('id', itemId);
  
  if (error) {
    console.error('Error deleting RSS item:', error);
    throw new Error('Failed to delete RSS item');
  }
};
