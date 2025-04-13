
import { EventCardProps } from "@/components/ui/EventCard";

export interface Venue {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  eventCount: number;
  events: EventCardProps[];
}

export interface MapMarkerReference {
  marker: any;
  infoWindow: any;
  venue: Venue;
}
