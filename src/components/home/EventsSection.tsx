
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import EventsCarousel from "./EventsCarousel";

interface EventsSectionProps {
  title: string;
  events: EventCardProps[];
  isLoading: boolean;
  linkPath: string;
  useCarousel?: boolean;
}

const EventsSection = ({ 
  title, 
  events, 
  isLoading, 
  linkPath,
  useCarousel = false 
}: EventsSectionProps) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link to={linkPath} className="flex items-center text-gray-400 hover:text-white transition-colors">
          <span className="mr-2">View All</span>
          <ArrowRight size={16} />
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : useCarousel ? (
        <EventsCarousel events={events} title={title} />
      ) : (
        <EventGrid events={events} />
      )}
    </section>
  );
};

export default EventsSection;
