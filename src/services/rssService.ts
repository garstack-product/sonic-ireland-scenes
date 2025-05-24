
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
}

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

export const getRssItems = async (): Promise<RssItem[]> => {
  const { data, error } = await supabase
    .from('rss_items')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching RSS items:', error);
    throw new Error('Failed to fetch RSS items');
  }
  
  return data || [];
};

export const addRssFeed = async (name: string, url: string): Promise<RssFeed> => {
  const { data, error } = await supabase
    .from('rss_feeds')
    .insert([{ name, url }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding RSS feed:', error);
    throw new Error('Failed to add RSS feed');
  }
  
  return data;
};

export const publishRssItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from('rss_items')
    .update({ is_published: true })
    .eq('id', itemId);
  
  if (error) {
    console.error('Error publishing RSS item:', error);
    throw new Error('Failed to publish RSS item');
  }
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
