
import { Button } from "@/components/ui/button";
import { EventCardProps } from "@/components/ui/EventCard";
import { Eye, EyeOff, Music, Check } from "lucide-react";

interface EventListItemProps {
  event: EventCardProps;
  isHidden: boolean;
  isFestival: boolean;
  isFeatured: boolean;
  onToggleVisibility: (id: string) => void;
  onToggleFestival: (id: string) => void;
  onToggleFeature: (id: string) => void;
}

const EventListItem = ({
  event,
  isHidden,
  isFestival,
  isFeatured,
  onToggleVisibility,
  onToggleFestival,
  onToggleFeature,
}: EventListItemProps) => {
  return (
    <div className="flex justify-between items-center p-3 bg-dark-400 rounded-md">
      <div>
        <h3 className="text-white font-medium">{event.title}</h3>
        <p className="text-gray-400 text-sm">{event.artist} • {event.venue}</p>
        <p className="text-gray-400 text-sm">{event.date}</p>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onToggleVisibility(event.id)}
          className={isHidden ? 'bg-gray-500 text-white' : 'bg-transparent'}
        >
          {isHidden ? (
            <><EyeOff size={16} className="mr-2" />Hidden</>
          ) : (
            <><Eye size={16} className="mr-2" />Visible</>
          )}
        </Button>

        <Button
          type="button"
          variant={isFestival ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleFestival(event.id)}
          className={isFestival ? 'bg-purple-600 hover:bg-purple-700 border-purple-600' : 'bg-transparent'}
        >
          {isFestival ? (
            <><Music size={16} className="mr-2" />Festival</>
          ) : (
            "Mark as Festival"
          )}
        </Button>

        <Button
          type="button"
          variant={isFeatured ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleFeature(event.id)}
        >
          {isFeatured ? (
            <><Check size={16} className="mr-2" />Featured</>
          ) : (
            "Feature"
          )}
        </Button>
      </div>
    </div>
  );
};

export default EventListItem;
