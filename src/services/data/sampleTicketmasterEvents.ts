
import { EventCardProps } from "@/components/ui/EventCard";

// Sample data for fallback when API is unavailable
export const sampleTicketmasterEvents: EventCardProps[] = [
  {
    id: "tm-1",
    title: "Coldplay: Music of the Spheres Tour",
    artist: "Coldplay",
    venue: "Croke Park, Dublin",
    date: "August 30, 2025",
    time: "6:30 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-08-30T18:30:00Z",
    onSaleDate: "2025-04-01T09:00:00Z"
  },
  {
    id: "tm-2",
    title: "Taylor Swift: The Eras Tour",
    artist: "Taylor Swift",
    venue: "Aviva Stadium, Dublin",
    date: "June 28-30, 2025",
    time: "7:00 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-06-28T19:00:00Z",
    onSaleDate: "2025-04-10T10:00:00Z"
  },
  {
    id: "tm-3",
    title: "Electric Picnic 2025",
    artist: "Various Artists",
    venue: "Stradbally Hall, Co. Laois",
    date: "September 5-7, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival",
    category: "listing",
    rawDate: "2025-09-05T12:00:00Z",
    onSaleDate: "2025-03-15T09:00:00Z"
  },
  {
    id: "tm-4",
    title: "Billie Eilish: Hit Me Hard and Soft Tour",
    artist: "Billie Eilish",
    venue: "3Arena, Dublin",
    date: "May 15, 2025",
    time: "8:00 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-05-15T20:00:00Z",
    onSaleDate: "2025-04-05T09:00:00Z"
  },
  {
    id: "tm-5",
    title: "Red Hot Chili Peppers",
    artist: "Red Hot Chili Peppers",
    venue: "Malahide Castle, Dublin",
    date: "June 20, 2025",
    time: "6:00 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-06-20T18:00:00Z",
    onSaleDate: "2025-04-12T10:00:00Z"
  },
  {
    id: "tm-6",
    title: "Arcade Fire: The Suburbs Anniversary",
    artist: "Arcade Fire",
    venue: "Olympia Theatre, Dublin",
    date: "July 15, 2025",
    time: "8:00 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-07-15T20:00:00Z",
    onSaleDate: "2025-04-20T09:00:00Z"
  },
  {
    id: "tm-7",
    title: "Longitude Festival 2025",
    artist: "Various Artists",
    venue: "Marlay Park, Dublin",
    date: "July 4-6, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival",
    category: "listing",
    rawDate: "2025-07-04T12:00:00Z",
    onSaleDate: "2025-03-01T09:00:00Z"
  },
  {
    id: "tm-8",
    title: "Dua Lipa: Future Nostalgia Tour",
    artist: "Dua Lipa",
    venue: "3Arena, Dublin",
    date: "October 3, 2025",
    time: "7:30 PM",
    imageUrl: "/placeholder.svg",
    type: "concert",
    category: "listing",
    rawDate: "2025-10-03T19:30:00Z",
    onSaleDate: "2025-03-25T09:00:00Z"
  }
];
