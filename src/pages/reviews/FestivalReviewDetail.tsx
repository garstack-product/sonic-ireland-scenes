
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFestivalReviews } from '@/services/festivalReviewService';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from 'lucide-react';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const additionalImages = review.additional_images?.filter(img => img && img.trim() !== '') || [];

  return (
    <div className="min-h-screen bg-dark-400">
      <div className="w-full">
        {/* Hero Section with Featured Image */}
        <div className="relative h-96 overflow-hidden">
          {review.image_url && review.image_url !== '/placeholder.svg' ? (
            <img 
              src={review.image_url} 
              alt={`${review.artist} at ${review.venue}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Failed to load featured image:', review.image_url);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{review.title}</h1>
                <p className="text-xl text-gray-200">{review.artist}</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{review.title}</h1>
              <h2 className="text-xl md:text-2xl text-gray-200 mb-2 drop-shadow-lg">{review.artist}</h2>
              <p className="text-gray-300 drop-shadow-lg">{review.venue} • {review.start_date} - {review.end_date}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full">
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
          </div>

          {/* Photo Gallery - Full Width to Match Featured Image */}
          {additionalImages.length > 0 && (
            <div className="w-full mt-12">
              <div className="container mx-auto px-4">
                <h3 className="text-2xl font-bold text-white mb-6">Photo Gallery</h3>
              </div>
              
              {/* Professional Collage Layout - Full Width */}
              <div className="w-full">
                {additionalImages.length === 1 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                        <img 
                          src={additionalImages[0]} 
                          alt="Festival photo"
                          className="w-full h-96 object-cover"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                          src={additionalImages[0]} 
                          alt="Festival photo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {additionalImages.length === 2 && (
                  <div className="grid grid-cols-2 gap-4">
                    {additionalImages.map((imageUrl, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                            <img 
                              src={imageUrl} 
                              alt={`Festival photo ${index + 1}`}
                              className="w-full h-64 object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black">
                          <div className="relative w-full h-full flex items-center justify-center">
                            <img 
                              src={imageUrl} 
                              alt={`Festival photo ${index + 1}`}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                )}

                {additionalImages.length === 3 && (
                  <div className="grid grid-cols-2 gap-4 h-96">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                          <img 
                            src={additionalImages[0]} 
                            alt="Festival photo 1"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img 
                            src={additionalImages[0]} 
                            alt="Festival photo 1"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="grid grid-rows-2 gap-4">
                      {additionalImages.slice(1, 3).map((imageUrl, index) => (
                        <Dialog key={index + 1}>
                          <DialogTrigger asChild>
                            <div className="cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                              <img 
                                src={imageUrl} 
                                alt={`Festival photo ${index + 2}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black">
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img 
                                src={imageUrl} 
                                alt={`Festival photo ${index + 2}`}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </div>
                )}

                {additionalImages.length >= 4 && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* First large image */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="lg:row-span-2 cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                          <img 
                            src={additionalImages[0]} 
                            alt="Festival photo 1"
                            className="w-full h-64 lg:h-full object-cover"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img 
                            src={additionalImages[0]} 
                            alt="Festival photo 1"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Rest of the images */}
                    {additionalImages.slice(1, 5).map((imageUrl, index) => (
                      <Dialog key={index + 1}>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300 relative">
                            <img 
                              src={imageUrl} 
                              alt={`Festival photo ${index + 2}`}
                              className="w-full h-32 object-cover"
                            />
                            {index === 3 && additionalImages.length > 5 && (
                              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">+{additionalImages.length - 5}</span>
                              </div>
                            )}
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black">
                          <div className="relative w-full h-full flex items-center justify-center">
                            <img 
                              src={imageUrl} 
                              alt={`Festival photo ${index + 2}`}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}

                    {/* Show remaining images if more than 5 */}
                    {additionalImages.length > 5 && (
                      <div className="col-span-2 lg:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {additionalImages.slice(5).map((imageUrl, index) => (
                          <Dialog key={index + 5}>
                            <DialogTrigger asChild>
                              <div className="cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                                <img 
                                  src={imageUrl} 
                                  alt={`Festival photo ${index + 6}`}
                                  className="w-full h-24 object-cover"
                                />
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black">
                              <div className="relative w-full h-full flex items-center justify-center">
                                <img 
                                  src={imageUrl} 
                                  alt={`Festival photo ${index + 6}`}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FestivalReviewDetail;
