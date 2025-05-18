import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getConcertReviews } from "@/services/concertReviewService";

interface ConcertReview {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  imageUrl: string;
  type: 'concert';
  category: 'review';
}

const ConcertReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<ConcertReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchReviews = async () => {
    try {
      const data = await getConcertReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch concert reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, []);

  // ... rest of your component

  const filteredReviews = reviews.filter(review => 
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-white">Loading reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Concert Reviews" 
        subtitle="Explore our collection of concert photography and reviews from venues across Ireland"
      />
      
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by artist, venue, or title..."
          className="pl-10 bg-dark-300 border-gray-700 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <EventGrid 
        events={filteredReviews} 
        emptyMessage="No concert reviews found. Try adjusting your search."
      />
    </div>
  );
};

export default ConcertReviewsPage;