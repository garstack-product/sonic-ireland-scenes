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
        {/* Festival Crowd Header Section */}
        <div 
          className="w-full h-96 relative flex items-center justify-center"
          style={{
            backgroundImage: 'url(/lovable-uploads/e3c81d4a-b2d9-4a04-a38c-8d5bb9671ec6.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{review.title}</h1>
            <h2 className="text-xl md:text-2xl text-gray-200 mb-2 drop-shadow-md">{review.artist}</h2>
            <p className="text-gray-300 drop-shadow-md">{review.venue} • {review.start_date} - {review.end_date}</p>
          </div>
        </div>

        {/* Content and Featured Image Section */}
        <div className="w-full">
          <div className="container mx-auto px-4 py-8">
            {/* Desktop Layout: Content left, Image right */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
              {/* Review Content - Left Side */}
              <div className="prose prose-invert prose-lg max-w-none">
                {review.content.split('\n').map((paragraph, i) => (
                  paragraph.trim() && (
                    <p key={i} className="mb-6 text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>

              {/* Featured Image - Right Side */}
              <div className="sticky top-8">
                {review.image_url && review.image_url !== '/placeholder.svg' ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300 rounded-lg">
                        <img 
                          src={review.image_url} 
                          alt={`${review.artist} at ${review.venue}`}
                          className="w-full h-auto object-cover rounded-lg"
                          onError={(e) => {
                            console.error('Failed to load featured image:', review.image_url);
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                          src={review.image_url} 
                          alt={`${review.artist} at ${review.venue}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">No featured image</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile/Tablet Layout: Image first, then content */}
            <div className="lg:hidden">
              {/* Featured Image - Mobile First */}
              <div className="mb-8">
                {review.image_url && review.image_url !== '/placeholder.svg' ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300 rounded-lg">
                        <img 
                          src={review.image_url} 
                          alt={`${review.artist} at ${review.venue}`}
                          className="w-full h-auto object-cover rounded-lg"
                          onError={(e) => {
                            console.error('Failed to load featured image:', review.image_url);
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                          src={review.image_url} 
                          alt={`${review.artist} at ${review.venue}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">No featured image</p>
                  </div>
                )}
              </div>

              {/* Review Content - Mobile Second */}
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
          </div>

          {/* Photo Gallery - Full Width */}
          {additionalImages.length > 0 && (
            <div className="w-full mt-12">
              <div className="container mx-auto px-4">
                <h3 className="text-2xl font-bold text-white mb-6">Photo Gallery</h3>
              </div>
              
              {/* Professional Collage Layout - Full Width */}
              <div className="w-full">
                {additionalImages.length === 1 && (
                  <div className="container mx-auto px-4">
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
                  </div>
                )}

                {additionalImages.length === 2 && (
                  <div className="container mx-auto px-4">
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
                  </div>
                )}

                {additionalImages.length === 3 && (
                  <div className="container mx-auto px-4">
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
                  </div>
                )}

                {additionalImages.length >= 4 && (
                  <div className="container mx-auto px-4">
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
