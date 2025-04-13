
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar } from "lucide-react";
import { Venue } from "@/types/venue";

interface VenueEventsListProps {
  venue: Venue;
  onBackClick: () => void;
}

const VenueEventsList = ({ venue, onBackClick }: VenueEventsListProps) => {
  return (
    <div>
      <Button 
        variant="ghost" 
        onClick={onBackClick}
        className="mb-4"
      >
        <ChevronRight className="rotate-180 mr-2" size={16} />
        Back to venues
      </Button>
      
      <h3 className="text-xl text-white font-semibold mb-4 flex items-center">
        <Calendar className="mr-2 text-rose-500" size={20} />
        Events at {venue.name}
        <span className="ml-2 text-sm bg-rose-500 text-white px-2 py-0.5 rounded-full">
          {venue.events.length}
        </span>
      </h3>
      
      <div className="space-y-4 w-full">
        {venue.events.map(event => (
          <Card key={event.id} className="bg-dark-400 border-gray-700 w-full">
            <CardContent className="p-4">
              <Link to={`/listings/${event.type}/${event.id}`} className="block">
                <h4 className="text-white font-medium mb-1">{event.title}</h4>
                <p className="text-gray-400 text-sm">{event.artist}</p>
                <p className="text-gray-400 text-sm mt-1">{event.date}</p>
                {event.time && (
                  <p className="text-gray-400 text-sm">{event.time}</p>
                )}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VenueEventsList;
