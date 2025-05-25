
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { fetchJustAnnouncedEvents } from "@/services/api/events/filterService";
import { toast } from "sonner";

const JustAnnouncedPage = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const justAnnouncedEvents = await fetchJustAnnouncedEvents();
        setEvents(justAnnouncedEvents);
      } catch (error) {
        console.error("Error fetching just announced events:", error);
        toast.error("Failed to load just announced events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Just Announced"
        subtitle="Check out the latest concert and festival announcements"
      />
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="mt-8">
          <EventGrid 
            events={events} 
            emptyMessage="No recently announced events found. Check back soon!"
          />
        </div>
      )}
    </div>
  );
};

export default JustAnnouncedPage;
