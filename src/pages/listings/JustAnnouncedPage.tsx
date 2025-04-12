
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { API_KEYS } from "@/config/api-keys";
import { toast } from "sonner";

// Format time from Ticketmaster API
const formatTime = (time: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? 'pm' : 'am';
  const hour12 = hourNum % 12 || 12; // Convert 0 to 12 for 12am
  return `${hour12}:${minute}${period}`;
};

// Format date from Ticketmaster API
const formatDate = (date: string) => {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const JustAnnouncedPage = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJustAnnouncedEvents = async () => {
      try {
        setIsLoading(true);
        
        // Get events for Ireland (countryCode=IE) that were recently announced
        // Sort by onSaleStartDate,desc to get most recently announced
        const response = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=IE&classificationName=music&sort=onSaleStartDate,desc&size=50&apikey=${API_KEYS.TICKETMASTER}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from Ticketmaster');
        }
        
        const data = await response.json();
        
        // Handle case where no events are found
        if (!data._embedded?.events) {
          setEvents([]);
          setIsLoading(false);
          return;
        }
        
        // Filter to get only events that went on sale in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Map Ticketmaster events to our event format
        const justAnnouncedEvents = data._embedded.events
          .filter((event: any) => {
            // Check if the onsale date is recent (within last 30 days)
            if (!event.sales?.public?.startDateTime) return false;
            const onsaleDate = new Date(event.sales.public.startDateTime);
            return onsaleDate >= thirtyDaysAgo;
          })
          .map((event: any) => {
            // Extract genre and subgenre information
            const genre = event.classifications?.[0]?.genre?.name || "";
            const subgenre = event.classifications?.[0]?.subGenre?.name || "";
            
            // Get venue info
            const venue = event._embedded?.venues?.[0]?.name || "";
            const city = event._embedded?.venues?.[0]?.city?.name || "";
            const venueFull = city ? `${venue}, ${city}` : venue;
            
            // Get image
            const imageUrl = event.images?.find((img: any) => img.ratio === "16_9" && img.width > 500)?.url 
              || event.images?.[0]?.url 
              || "/placeholder.svg";
              
            // Get date and time
            const startDate = event.dates?.start?.localDate || "";
            const startTime = event.dates?.start?.localTime || "";
            const formattedDate = formatDate(startDate);
            const formattedTime = formatTime(startTime);
            
            return {
              id: event.id,
              title: `Just Announced: ${event.name}`,
              artist: event.name.includes(":") ? event.name.split(":")[0] : event._embedded?.attractions?.[0]?.name || "",
              venue: venueFull,
              date: formattedDate,
              time: formattedTime,
              imageUrl: imageUrl,
              type: "concert" as const,
              category: "listing" as const,
              genre: genre !== "Undefined" ? genre : undefined,
              subgenre: subgenre !== "Undefined" ? subgenre : undefined
            };
          });
        
        setEvents(justAnnouncedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Ticketmaster data:", error);
        toast.error("Failed to load just announced events. Please try again later.");
        setIsLoading(false);
      }
    };
    
    fetchJustAnnouncedEvents();
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
