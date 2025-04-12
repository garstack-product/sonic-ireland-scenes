
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventGrid from "@/components/ui/EventGrid";
import { fetchJustAnnouncedEvents, fetchUpcomingEvents, fetchFeaturedEvents } from "@/services/api";
import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import EventCard from "@/components/ui/EventCard";

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
        
        // Load upcoming events (next 3 days)
        const upcoming = await fetchUpcomingEvents(3);
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

  const renderEventCarousel = (events: EventCardProps[], title: string) => {
    if (events.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400">
          No {title.toLowerCase()} events found
        </div>
      );
    }

    return (
      <Carousel className="w-full">
        <CarouselContent>
          {events.map((event) => (
            <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="p-1">
                <EventCard {...event} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:flex justify-end mt-4">
          <CarouselPrevious className="relative inset-0 translate-y-0 left-0 mr-2" />
          <CarouselNext className="relative inset-0 translate-y-0 right-0" />
        </div>
      </Carousel>
    );
  };

  return (
    <div className="space-y-20">
      {/* Hero Section with Featured Events Carousel */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden rounded-xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="/placeholder.svg" 
            alt="Concert" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-500 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Dirty Boots
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Ireland's premier music photography and event guide for concerts and festivals
          </p>
          
          {/* Featured Events Carousel */}
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="bg-dark-500/80 backdrop-blur-md p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Featured Events</h2>
              {renderEventCarousel(featuredEvents, "Featured")}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-dark-500 hover:bg-gray-200">
                <Link to="/listings/concerts">
                  Explore Events
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/reviews/concerts">
                  Read Reviews
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Just Announced */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Just Announced</h2>
          <Link to="/listings/just-announced" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <span className="mr-2">View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <EventGrid events={justAnnouncedEvents} />
        )}
      </section>
      
      {/* Upcoming Events (Next 3 Days) */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Upcoming Events (Next 3 Days)</h2>
          <Link to="/listings/concerts" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <span className="mr-2">View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          renderEventCarousel(upcomingEvents, "Upcoming")
        )}
      </section>
      
      {/* Recent Reviews */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Recent Reviews</h2>
          <Link to="/reviews/concerts" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <span className="mr-2">View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <EventGrid events={recentReviews} />
      </section>
      
      {/* Newsletter */}
      <section className="bg-dark-300 rounded-xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8">
            Subscribe to our newsletter for the latest concert announcements, festival lineups, and exclusive photography.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-4 py-3 rounded-md bg-dark-400 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <Button className="bg-white text-dark-500 hover:bg-gray-200 sm:w-auto">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
