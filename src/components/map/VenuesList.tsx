
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Venue } from "@/types/venue";
import { ChevronRight } from "lucide-react";

interface VenuesListProps {
  venues: Venue[];
  isLoading: boolean;
  onVenueClick: (venue: Venue) => void;
}

const VenuesList = ({ venues, isLoading, onVenueClick }: VenuesListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl text-white font-semibold mb-4">Venues</h3>
      <div className="space-y-2">
        {venues
          .sort((a, b) => b.eventCount - a.eventCount) // Sort by event count
          .map(venue => (
          <Button
            key={venue.id}
            variant="ghost"
            onClick={() => onVenueClick(venue)}
            className="w-full justify-start text-left p-3 h-auto"
          >
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 mr-3">
                <div className="bg-rose-500 text-white rounded-full flex items-center justify-center" 
                     style={{ 
                       width: `${Math.min(Math.max(24 + venue.eventCount, 24), 40)}px`, 
                       height: `${Math.min(Math.max(24 + venue.eventCount, 24), 40)}px` 
                     }}>
                  <span className="text-xs font-bold">{venue.eventCount}</span>
                </div>
              </div>
              <div className="flex-grow">
                <div className="font-medium">{venue.name}</div>
                <div className="text-gray-400 text-sm">{venue.city}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VenuesList;
