
import EventCard, { EventCardProps } from "./EventCard";

interface EventGridProps {
  events: EventCardProps[];
  emptyMessage?: string;
}

const EventGrid = ({ events, emptyMessage = "No events found" }: EventGridProps) => {
  if (!events.length) {
    return (
      <div className="py-12 text-center text-gray-400">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  );
};

export default EventGrid;
