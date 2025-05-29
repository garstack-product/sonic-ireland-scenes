
import { supabase } from "@/integrations/supabase/client";

interface ConcertReview {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  image_url?: string;
  additional_images?: string[];
  content: string;
  created_at: string;
}

export const getConcertReviews = async (): Promise<ConcertReview[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
  
  return data || [];
};

export const addConcertReview = async (
  review: Omit<ConcertReview, 'id' | 'created_at'>
): Promise<ConcertReview> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      title: review.title,
      artist: review.artist,
      venue: review.venue,
      date: review.date,
      image_url: review.image_url,
      additional_images: review.additional_images,
      content: review.content
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding review:', error);
    throw new Error('Failed to add review');
  }
  
  return data;
};
