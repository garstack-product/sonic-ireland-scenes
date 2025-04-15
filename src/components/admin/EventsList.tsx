
import { EventCardProps } from "@/components/ui/EventCard";
import EventListItem from "./EventListItem";

interface EventsListProps {
  events: EventCardProps[];
  hiddenEvents: string[];
  festivalEvents: string[];
  featuredEvents: string[];
  onToggleVisibility: (id: string) => void;
  onToggleFestival: (id: string) => void;
  onToggleFeature: (id: string) => void;
}

const EventsList = ({
  events,
  hiddenEvents,
  festivalEvents,
  featuredEvents,
  onToggleVisibility,
  onToggleFestival,
  onToggleFeature,
}: EventsListProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400">
        No events found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
      {events.map(event => (
        <EventListItem
          key={event.id}
          event={event}
          isHidden={hiddenEvents.includes(event.id)}
          isFestival={festivalEvents.includes(event.id)}
          isFeatured={featuredEvents.includes(event.id)}
          onToggleVisibility={onToggleVisibility}
          onToggleFestival={onToggleFestival}
          onToggleFeature={onToggleFeature}
        />
      ))}
    </div>
  );
};

export default EventsList;
