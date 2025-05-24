
import { supabase } from "@/integrations/supabase/client";

interface FestivalReview {
  id: string;
  title: string;
  artist: string;
  venue: string;
  start_date: string;
  end_date: string;
  image_url?: string;
  content: string;
  created_at: string;
}

export const getFestivalReviews = async (): Promise<FestivalReview[]> => {
  const { data, error } = await supabase
    .from('festival_reviews')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching festival reviews:', error);
    throw new Error('Failed to fetch festival reviews');
  }
  
  return data || [];
};

export const addFestivalReview = async (
  review: Omit<FestivalReview, 'id' | 'created_at'>
): Promise<FestivalReview> => {
  const { data, error } = await supabase
    .from('festival_reviews')
    .insert([{
      title: review.title,
      artist: review.artist,
      venue: review.venue,
      start_date: review.start_date,
      end_date: review.end_date,
      image_url: review.image_url,
      content: review.content
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding festival review:', error);
    throw new Error('Failed to add festival review');
  }
  
  return data;
};
