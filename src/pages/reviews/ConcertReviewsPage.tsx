
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data - this would come from your database
const concertReviews = [
  {
    id: "1",
    title: "Unforgettable Night",
    artist: "Arcade Fire",
    venue: "3Arena, Dublin",
    date: "March 6, 2025",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "review" as const
  },
  {
    id: "2",
    title: "Soulful Performance",
    artist: "Leon Bridges",
    venue: "Olympia Theatre, Dublin",
    date: "February 18, 2025",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "review" as const
  },
  {
    id: "3",
    title: "Electric Set",
    artist: "Fontaines D.C.",
    venue: "Vicar Street, Dublin",
    date: "January 30, 2025",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "review" as const
  },
  {
    id: "4",
    title: "Irish Folk Revival",
    artist: "The Frames",
    venue: "National Concert Hall, Dublin",
    date: "January 15, 2025",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "review" as const
  }
];

const ConcertReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredReviews = concertReviews.filter(review => 
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
