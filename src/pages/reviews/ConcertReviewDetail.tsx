import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getConcertReviews } from '@/services/concertReviewService';

interface ConcertReview {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  imageUrl: string;
  content: string;
  type: 'concert';
  category: 'review';
}

const ConcertReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<ConcertReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviews = await getConcertReviews();
        const foundReview = reviews.find(r => r.id === id);
        if (foundReview) {
          setReview(foundReview);
        }
      } catch (error) {
        console.error("Failed to fetch review:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReview();
  }, [id]);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!review) {
    return <div className="text-white">Review not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-2">{review.title}</h1>
      <h2 className="text-xl text-gray-300 mb-4">{review.artist} at {review.venue}</h2>
      <p className="text-gray-400 mb-6">{review.date}</p>
      
      <div className="mb-8">
        <img 
          src={review.imageUrl} 
          alt={`${review.artist} at ${review.venue}`}
          className="w-full h-auto rounded-lg"
        />
      </div>
      
      <div className="prose prose-invert max-w-none">
        {review.content.split('\n').map((paragraph, i) => (
          <p key={i} className="mb-4 text-gray-300">{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default ConcertReviewDetail;