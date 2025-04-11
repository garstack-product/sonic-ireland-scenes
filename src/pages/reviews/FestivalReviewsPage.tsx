
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data - this would come from your database
const festivalReviews = [
  {
    id: "1",
    title: "Weekend of Music",
    artist: "Electric Picnic",
    venue: "Stradbally Hall, Co. Laois",
    date: "September 1-3, 2024",
    imageUrl: "/placeholder.svg",
    type: "festival" as const,
    category: "review" as const
  },
  {
    id: "2",
    title: "Summer Vibes",
    artist: "Longitude Festival",
    venue: "Marlay Park, Dublin",
    date: "July 5-7, 2024",
    imageUrl: "/placeholder.svg",
    type: "festival" as const,
    category: "review" as const
  },
  {
    id: "3",
    title: "Rock Legends",
    artist: "All Together Now",
    venue: "Curraghmore Estate, Co. Waterford",
    date: "August 2-4, 2024",
    imageUrl: "/placeholder.svg",
    type: "festival" as const,
    category: "review" as const
  }
];

const FestivalReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredReviews = festivalReviews.filter(review => 
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="Festival Reviews" 
        subtitle="Explore our collection of festival photography and reviews from across Ireland"
      />
      
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by festival, location, or title..."
          className="pl-10 bg-dark-300 border-gray-700 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <EventGrid 
        events={filteredReviews} 
        emptyMessage="No festival reviews found. Try adjusting your search."
      />
    </div>
  );
};

export default FestivalReviewsPage;
