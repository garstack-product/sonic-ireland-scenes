
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EventCardProps } from "@/components/ui/EventCard";
import EventCard from "@/components/ui/EventCard";

interface EventsCarouselProps {
  events: EventCardProps[];
  title: string;
}

const EventsCarousel = ({ events, title }: EventsCarouselProps) => {
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

export default EventsCarousel;
