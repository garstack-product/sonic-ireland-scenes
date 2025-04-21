import { EventCardProps } from "@/components/ui/EventCard";
import { formatDate, formatTime } from "../utils/formatUtils";
import { isSportsEvent } from "../utils/filterUtils";

// Map Ticketmaster events to our application format
export const mapTicketmasterEvents = (events: any[]): EventCardProps[] => {
  return events
    .filter(event => !isSportsEvent(event))
    .map((event: any) => {
      // Extract genre and subgenre information
      const genre = event.classifications?.[0]?.genre?.name || "";
      const subgenre = event.classifications?.[0]?.subGenre?.name || "";
      
      // Get venue info
      const venue = event._embedded?.venues?.[0]?.name || "";
      const city = event._embedded?.venues?.[0]?.city?.name || "";
      const venueFull = city ? `${venue}, ${city}` : venue;
      
      // Get price info with both min and max values
      const minPrice = event.priceRanges?.[0]?.min;
      const maxPrice = event.priceRanges?.[0]?.max;
      
      // Get best image (prefer large 16:9 ratio)
      const imageUrl = 
        event._embedded?.venues?.[0]?.images?.[0]?.url ||
        event.images?.find((img: any) => img.ratio === "16_9" && img.width > 500)?.url ||
        event.images?.find((img: any) => img.width > 500)?.url ||
        event.images?.[0]?.url ||
        "/placeholder.svg";
        
      // Get date and time
      const startDate = event.dates?.start?.localDate || "";
      const startTime = event.dates?.start?.localTime || "";
      const formattedDate = formatDate(startDate);
      const formattedTime = formatTime(startTime);
      
      // Try to extract artist name from name or attractions
      let artistName = "";
      if (event._embedded?.attractions?.[0]?.name) {
        artistName = event._embedded.attractions[0].name;
      } else if (event.name && event.name.includes(":")) {
        artistName = event.name.split(":")[0].trim();
      } else {
        artistName = event.name;
      }
      
      return {
        id: event.id || `custom-${Math.random().toString(36).substr(2, 9)}`,
        title: event.name || "",
        artist: artistName,
        venue: venueFull,
        date: formattedDate,
        time: formattedTime,
        imageUrl: imageUrl,
        type: "concert" as const,
        category: "listing" as const,
        genre: genre !== "Undefined" ? genre : undefined,
        subgenre: subgenre !== "Undefined" ? subgenre : undefined,
        price: minPrice || undefined,
        maxPrice: maxPrice && maxPrice > minPrice ? maxPrice : undefined,
        ticketUrl: event.url,
        rawDate: startDate,
        onSaleDate: event.sales?.public?.startDateTime || null,
        start_price: minPrice || undefined,
        max_price: maxPrice && maxPrice > minPrice ? maxPrice : undefined,
      };
    });
};

export const ticketmasterToEventCard = (event: any): EventCardProps => {
  const mapped = mapTicketmasterEvents([event]);
  return mapped.length > 0 ? mapped[0] : null;
};
