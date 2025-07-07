import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import { fetchFeaturedEvents } from "@/services/api";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const FeaturedEventsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredEvents, setFeaturedEvents] = useState<EventCardProps[]>([]);
  
  useEffect(() => {
    const loadFeaturedEvents = async () => {
      try {
        setIsLoading(true);
        const events = await fetchFeaturedEvents();
        setFeaturedEvents(events);
        console.log(`Loaded ${events.length} featured events`);
      } catch (error) {
        console.error("Error loading featured events:", error);
        toast.error("Failed to load featured events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedEvents();
  }, []);

  // Group events by month for dividers
  const groupedByMonth = featuredEvents.reduce((groups, event) => {
    const eventDate = new Date(event.rawDate || event.date);
    const monthYear = format(eventDate, 'MMMM yyyy');
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {} as Record<string, EventCardProps[]>);

  return (
    <div>
      <PageHeader 
        title="Featured Events" 
        subtitle="Hand-picked exceptional events in Ireland"
      />
      
      <div className="mb-6 mt-4">
        <p className="text-gray-400">
          {isLoading ? "Loading featured events..." : `${featuredEvents.length} featured events found`}
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : featuredEvents.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No featured events available at the moment. Check back soon!
        </div>
      ) : (
        <>
          {Object.entries(groupedByMonth).map(([monthYear, events], monthIndex) => (
            <div key={monthYear}>
              {monthIndex > 0 && (
                <div className="my-8 flex items-center">
                  <Separator className="flex-1" />
                  <div className="mx-4 text-sm text-gray-400 font-medium">
                    {monthYear}
                  </div>
                  <Separator className="flex-1" />
                </div>
              )}
              
              {monthIndex === 0 && (
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-medium text-gray-300">{monthYear}</h3>
                </div>
              )}
              
              <EventGrid 
                events={events} 
                emptyMessage=""
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedEventsPage;