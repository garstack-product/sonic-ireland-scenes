import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AllReviewsPage = () => {
  const [recentReviews] = useState<EventCardProps[]>([
    {
      id: "1",
      title: "Soulful Performance",
      artist: "Leon Bridges",
      venue: "Olympia Theatre, Dublin",
      date: "April 10, 2025",
      time: "8:00pm",
      imageUrl: "/placeholder.svg",
      type: "concert" as const,
      category: "review" as const
    },
    {
      id: "2",
      title: "Electric Atmosphere",
      artist: "Longitude Festival",
      venue: "Marlay Park, Dublin",
      date: "March 5-7, 2025",
      imageUrl: "/placeholder.svg",
      type: "festival" as const,
      category: "review" as const
    }
  ]);

  return (
    <div>
      <PageHeader
        title="Recent Reviews"
        subtitle="Latest concert and festival reviews from our team"
      />
      
      <div className="mb-6 mt-4 flex gap-4">
        <Link to="/reviews/concerts">
          <Button variant="outline">Concert Reviews</Button>
        </Link>
        <Link to="/reviews/festivals">
          <Button variant="outline">Festival Reviews</Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-400">
          {recentReviews.length} recent reviews available
        </p>
      </div>
      
      <EventGrid 
        events={recentReviews} 
        emptyMessage="No recent reviews available."
      />
    </div>
  );
};

export default AllReviewsPage;