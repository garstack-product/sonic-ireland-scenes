
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FeaturedEventsCarousel from "./FeaturedEventsCarousel";
import { EventCardProps } from "@/components/ui/EventCard";

interface HomeHeroSectionProps {
  featuredEvents: EventCardProps[];
  isLoading: boolean;
}

const HomeHeroSection = ({ featuredEvents, isLoading }: HomeHeroSectionProps) => {
  return (
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
        <div className="bg-dark-500/80 backdrop-blur-md p-6 rounded-lg">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Dirty Boots
          </h1>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Ireland's premier music photography and event guide for concerts and festivals
          </p>
          <FeaturedEventsCarousel events={featuredEvents} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
