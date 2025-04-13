
import { EventCardProps } from "@/components/ui/EventCard";
import EventsCarousel from "./EventsCarousel";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeaturedEventsSectionProps {
  featuredEvents: EventCardProps[];
  isLoading: boolean;
}

const FeaturedEventsSection = ({ featuredEvents, isLoading }: FeaturedEventsSectionProps) => {
  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Dirty Boots
        </h1>
        <Link to="/listings/concerts" className="flex items-center text-gray-400 hover:text-white transition-colors">
          <span className="mr-2">All Events</span>
          <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="mb-4">
        <p className="text-lg text-gray-200">
          Ireland's premier music photography and event guide for concerts and festivals
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : featuredEvents.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No featured events found
        </div>
      ) : (
        <EventsCarousel events={featuredEvents} title="Featured Events" />
      )}
    </section>
  );
};

export default FeaturedEventsSection;
