
import { EventCardProps } from "@/components/ui/EventCard";
import { formatDate, formatTime } from "../utils/formatUtils";

// Map Eventbrite events to our application format
export const mapEventbriteEvents = (events: any[]): EventCardProps[] => {
  return events
    .filter(event => {
      // Filter only music events from Eventbrite
      const categoryId = event.category_id;
      // Music category in Eventbrite is typically 103
      return categoryId === "103" || 
             event.name?.text?.toLowerCase().includes("music") ||
             event.name?.text?.toLowerCase().includes("concert") ||
             event.name?.text?.toLowerCase().includes("festival");
    })
    .map((event: any) => {
      // Get image
      const imageUrl = event.logo?.url || "/placeholder.svg";
      
      // Get date and time
      const startDate = event.start?.local?.split('T')[0] || "";
      const startTime = event.start?.local?.split('T')[1]?.substring(0, 5) || "";
      const formattedDate = formatDate(startDate);
      const formattedTime = formatTime(startTime);
      
      // Get venue info
      const venue = event.venue?.name || "";
      const city = event.venue?.address?.city || "Dublin";
      const venueFull = city ? `${venue}, ${city}` : venue;
      
      return {
        id: `eb-${event.id}` || `custom-${Math.random().toString(36).substr(2, 9)}`,
        title: event.name?.text || "",
        artist: event.organizer?.name || "",
        venue: venueFull,
        date: formattedDate,
        time: formattedTime,
        imageUrl: imageUrl,
        type: "concert" as const,
        category: "listing" as const,
        genre: "Music",
        price: event.ticket_availability?.minimum_ticket_price?.major_value || 0,
        ticketUrl: event.url,
        rawDate: startDate,
        onSaleDate: event.published || null
      };
    });
};

export const eventbriteToEventCard = (event: any): EventCardProps => {
  const mapped = mapEventbriteEvents([event]);
  return mapped.length > 0 ? mapped[0] : null;
};
