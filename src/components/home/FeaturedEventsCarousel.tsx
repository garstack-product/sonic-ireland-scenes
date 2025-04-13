
import { useState, useEffect } from "react";
import { EventCardProps } from "@/components/ui/EventCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import EventCard from "@/components/ui/EventCard";

interface FeaturedEventsCarouselProps {
  events: EventCardProps[];
  isLoading: boolean;
}

const FeaturedEventsCarousel = ({ events, isLoading }: FeaturedEventsCarouselProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">No Featured Events</h2>
        <p className="text-gray-300">
          Visit the admin page to set featured events
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Featured Events</h2>
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
    </div>
  );
};

export default FeaturedEventsCarousel;
