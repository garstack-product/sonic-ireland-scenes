
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventGrid from "@/components/ui/EventGrid";

// Mock data - this would come from your API in a real app
const featuredEvents = [
  {
    id: "1",
    title: "Summer Breeze Festival",
    artist: "Multiple Artists",
    venue: "Phoenix Park, Dublin",
    date: "July 15-17, 2025",
    time: "12:00pm",
    imageUrl: "/placeholder.svg",
    type: "festival" as const,
    category: "listing" as const
  },
  {
    id: "2",
    title: "Rock Legends Tour",
    artist: "Vintage Trouble",
    venue: "3Arena, Dublin",
    date: "August 22, 2025",
    time: "7:30pm",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const
  },
  {
    id: "3",
    title: "Electronic Night",
    artist: "DJ Pulse",
    venue: "The Academy, Dublin",
    date: "June 5, 2025",
    time: "8:00pm",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const
  }
];

const recentReviews = [
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
];

const justAnnouncedEvents = [
  {
    id: "ja1",
    title: "Just Announced: Rock Revival",
    artist: "Thunder & Lightning",
    venue: "Vicar Street, Dublin",
    date: "September 18, 2025",
    time: "8:30pm",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const
  },
  {
    id: "ja2",
    title: "Just Announced: Jazz Night",
    artist: "The Jazz Collective",
    venue: "National Concert Hall",
    date: "October 5, 2025",
    time: "7:00pm",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const
  },
  {
    id: "ja3",
    title: "Just Announced: Autumn Festival",
    artist: "Various Artists",
    venue: "Phoenix Park, Dublin",
    date: "October 15-17, 2025",
    time: "12:00pm",
    imageUrl: "/placeholder.svg",
    type: "festival" as const,
    category: "listing" as const
  }
];

const HomePage = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden rounded-xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="/placeholder.svg" 
            alt="Concert" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-500 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Dirty Boots
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Ireland's premier music photography and event guide for concerts and festivals
          </p>
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
        <EventGrid events={justAnnouncedEvents} />
      </section>
      
      {/* Upcoming Events */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
          <Link to="/listings/concerts" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <span className="mr-2">View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <EventGrid events={featuredEvents} />
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
