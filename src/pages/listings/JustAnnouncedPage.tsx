
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";

// Mock data - in a real app, this would come from the Ticketmaster & Eventbrite APIs
const justAnnouncedEvents = [
  {
    id: "ja1",
    title: "Just Announced: Summer Festival",
    artist: "Various Artists",
    venue: "Phoenix Park",
    date: "August 15, 2025",
    time: "12:00pm",
    imageUrl: "/placeholder.svg",
    type: "festival" as const,
    category: "listing" as const
  },
  {
    id: "ja2",
    title: "Just Announced: Rock Concert",
    artist: "The Rockers",
    venue: "3Arena",
    date: "July 22, 2025",
    time: "7:30pm",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const
  },
  {
    id: "ja3",
    title: "Just Announced: Pop Sensation",
    artist: "Pop Star",
    venue: "Olympia Theatre",
    date: "June 10, 2025",
    time: "8:00pm",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const
  }
];

const JustAnnouncedPage = () => {
  const [events] = useState(justAnnouncedEvents);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Just Announced"
        subtitle="Check out the latest concert and festival announcements"
      />
      
      <div className="mt-8">
        <EventGrid events={events} />
      </div>
    </div>
  );
};

export default JustAnnouncedPage;
