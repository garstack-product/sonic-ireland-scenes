
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFestivalReviews } from '@/services/festivalReviewService';

interface FestivalReview {
  id: string;
  title: string;
  artist: string;
  venue: string;
  start_date: string;
  end_date: string;
  image_url?: string;
  additional_images?: string[];
  content: string;
  created_at: string;
}

const FestivalReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<FestivalReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviews = await getFestivalReviews();
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
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Review not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-400">
      <div className="w-full">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={review.image_url || '/placeholder.svg'} 
            alt={`${review.artist} at ${review.venue}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{review.title}</h1>
              <h2 className="text-xl md:text-2xl text-gray-200 mb-2">{review.artist}</h2>
              <p className="text-gray-300">{review.venue} • {review.start_date} - {review.end_date}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="prose prose-invert prose-lg max-w-none">
            {review.content.split('\n').map((paragraph, i) => (
              paragraph.trim() && (
                <p key={i} className="mb-6 text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              )
            ))}
          </div>

          {/* Additional Images Gallery */}
          {review.additional_images && review.additional_images.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6">Photo Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {review.additional_images.map((imageUrl, index) => (
                  <div key={index} className="overflow-hidden rounded-lg">
                    <img 
                      src={imageUrl} 
                      alt={`${review.artist} additional photo ${index + 1}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FestivalReviewDetail;
