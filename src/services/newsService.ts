
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  date: string;
  category?: string;
  image_url?: string;
  tags?: string[];
  created_at: string;
  url?: string;
}

export const getNewsItems = async (): Promise<NewsItem[]> => {
  const { data, error } = await supabase
    .from('news_items')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching news items:', error);
    throw new Error('Failed to fetch news items');
  }
  
  return data || [];
};

export const addNewsItem = async (
  news: Omit<NewsItem, 'id' | 'created_at'>
): Promise<NewsItem> => {
  const { data, error } = await supabase
    .from('news_items')
    .insert([{
      title: news.title,
      content: news.content,
      excerpt: news.excerpt,
      author: news.author || 'Admin',
      date: news.date,
      category: news.category || 'General',
      image_url: news.image_url,
      tags: news.tags || [],
      url: news.url
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding news item:', error);
    throw new Error('Failed to add news item');
  }
  
  return data;
};

export const updateNewsItem = async (
  id: string,
  updates: Partial<Omit<NewsItem, 'id' | 'created_at'>>
): Promise<NewsItem> => {
  const { data, error } = await supabase
    .from('news_items')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating news item:', error);
    throw new Error('Failed to update news item');
  }
  
  return data;
};
