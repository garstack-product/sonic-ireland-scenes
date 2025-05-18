// src/services/concertReviewService.ts
const API_URL = 'http://localhost:5000/api';

interface ConcertReview {
  id: number;
  title: string;
  artist: string;
  venue: string;
  date: string;
  image_url?: string;
  content: string;
  created_at: string;
}

export const getConcertReviews = async (): Promise<ConcertReview[]> => {
  const response = await fetch(`${API_URL}/reviews`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
};

export const addConcertReview = async (
  review: Omit<ConcertReview, 'id' | 'created_at'>
): Promise<ConcertReview> => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  if (!response.ok) throw new Error('Failed to add review');
  return response.json();
};