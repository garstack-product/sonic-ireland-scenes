import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { fetchUpcomingEvents } from "@/services/api";
import { toast } from "sonner";

const ThisWeekEventsPage = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const upcomingEvents = await fetchUpcomingEvents(7);
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching this week's events:", error);
        toast.error("Failed to load this week's events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  return (
    <div>
      <PageHeader
        title="This Week's Events"
        subtitle="Upcoming concerts and festivals in the next 7 days"
      />
      
      <div className="mb-6 mt-4">
        <p className="text-gray-400">
          {isLoading ? "Loading this week's events..." : `${events.length} events found for this week`}
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No events found for this week. Check back soon!
        </div>
      ) : (
        <EventGrid 
          events={events} 
          emptyMessage=""
        />
      )}
    </div>
  );
};

export default ThisWeekEventsPage;