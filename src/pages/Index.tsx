
import { useState, useEffect } from "react";
import { fetchJustAnnouncedEvents, fetchUpcomingEvents, fetchFeaturedEvents } from "@/services/api";
import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import EventsSection from "@/components/home/EventsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import FeaturedEventsSection from "@/components/home/FeaturedEventsSection";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [justAnnouncedEvents, setJustAnnouncedEvents] = useState<EventCardProps[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventCardProps[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventCardProps[]>([]);
  const [recentReviews, setRecentReviews] = useState<EventCardProps[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        
        // Load just announced events
        const justAnnounced = await fetchJustAnnouncedEvents();
        setJustAnnouncedEvents(justAnnounced);
        
        // Load upcoming events (next 7 days)
        const upcoming = await fetchUpcomingEvents(7);
        setUpcomingEvents(upcoming);
        
        // Load featured events
        const featured = await fetchFeaturedEvents();
        setFeaturedEvents(featured);
        
        // Mock recent reviews for now
        setRecentReviews([
          {
            id: "1",
            title: "Soulful Performance",
            artist: "Leon Bridges",
            venue: "Olympia Theatre, Dublin",
            date: "April 10, 2025",
            time: "8:00pm",
            imageUrl: "/placeholder.svg",
            type: "concert" as const,
            category: "review" as const
          },
          {
            id: "2",
            title: "Electric Atmosphere",
            artist: "Longitude Festival",
            venue: "Marlay Park, Dublin",
            date: "March 5-7, 2025",
            imageUrl: "/placeholder.svg",
            type: "festival" as const,
            category: "review" as const
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading homepage events:", error);
        toast.error("Failed to load events");
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, []);

  return (
    <div className="space-y-20">
      {/* Featured Events Section (replacing Hero Section) */}
      <FeaturedEventsSection 
        featuredEvents={featuredEvents} 
        isLoading={isLoading} 
      />
      
      {/* Just Announced */}
      <EventsSection
        title="Just Announced"
        events={justAnnouncedEvents}
        isLoading={isLoading}
        linkPath="/listings/just-announced"
      />
      
      {/* This Week's Events */}
      <EventsSection
        title="This Week's Events"
        events={upcomingEvents}
        isLoading={isLoading}
        linkPath="/listings/concerts"
        useCarousel={true}
      />
      
      {/* Recent Reviews */}
      <EventsSection
        title="Recent Reviews"
        events={recentReviews}
        isLoading={false}
        linkPath="/reviews/concerts"
      />
      
      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
