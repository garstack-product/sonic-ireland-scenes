
import { EventCardProps } from "@/components/ui/EventCard";
import EventsCarousel from "./EventsCarousel";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeaturedEventsSectionProps {
  featuredEvents: EventCardProps[];
  isLoading: boolean;
}

const FeaturedEventsSection = ({ featuredEvents, isLoading }: FeaturedEventsSectionProps) => {
  // Only show actually featured events that are in the future and in Ireland
  const today = new Date();
  const actualFeaturedEvents = featuredEvents.filter(event => {
    // Must be marked as featured
    if (event.is_featured !== true) return false;
    
    // Must be in the future
    if (event.rawDate) {
      const eventDate = new Date(event.rawDate);
      if (eventDate < today) return false;
    }
    
    // Must be in Ireland
    const isIreland = event.country === 'Ireland' || 
                     event.venue?.toLowerCase().includes('dublin') ||
                     event.venue?.toLowerCase().includes('cork') ||
                     event.venue?.toLowerCase().includes('galway') ||
                     event.venue?.toLowerCase().includes('belfast') ||
                     event.venue?.toLowerCase().includes('limerick') ||
                     event.venue?.toLowerCase().includes('waterford') ||
                     event.venue?.toLowerCase().includes('kilkenny') ||
                     event.venue?.toLowerCase().includes('derry') ||
                     event.venue?.toLowerCase().includes('ireland');
    
    return isIreland;
  });

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Featured Events</h2>
        <a href="/listings/featured" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-white transition-colors">
          <span className="mr-2">All Featured Events</span>
          <ArrowRight size={16} />
        </a>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : actualFeaturedEvents.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No featured events found. Visit the admin page to set featured events.
        </div>
      ) : (
        <EventsCarousel events={actualFeaturedEvents} title="Featured Events" />
      )}
    </section>
  );
};

export default FeaturedEventsSection;
