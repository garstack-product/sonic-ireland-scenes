
import { EventCardProps } from "@/components/ui/EventCard";
import EventsCarousel from "./EventsCarousel";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeaturedEventsSectionProps {
  featuredEvents: EventCardProps[];
  isLoading: boolean;
}

const FeaturedEventsSection = ({ featuredEvents, isLoading }: FeaturedEventsSectionProps) => {
  // Show a max of 10 featured events
  const limitedEvents = featuredEvents.slice(0, 10);

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Featured Events</h2>
        <Link to="/listings/concerts" className="flex items-center text-gray-400 hover:text-white transition-colors">
          <span className="mr-2">All Events</span>
          <ArrowRight size={16} />
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : limitedEvents.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No featured events found
        </div>
      ) : (
        <EventsCarousel events={limitedEvents} title="Featured Events" />
      )}
    </section>
  );
};

export default FeaturedEventsSection;
