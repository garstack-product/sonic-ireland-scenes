
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";

// Mock venue data - this would normally come from your API
const venues = [
  {
    id: "v1",
    name: "3Arena",
    location: "Dublin",
    eventCount: 12,
    lat: 53.347,
    lng: -6.229,
    events: [
      {
        id: "1001",
        title: "Rock Revival",
        artist: "Foo Fighters",
        venue: "3Arena, Dublin",
        date: "July 22, 2025",
        imageUrl: "/placeholder.svg",
        type: "concert" as const,
        category: "listing" as const
      },
      {
        id: "1002",
        title: "Pop Sensation",
        artist: "Taylor Swift",
        venue: "3Arena, Dublin",
        date: "August 10, 2025",
        imageUrl: "/placeholder.svg",
        type: "concert" as const,
        category: "listing" as const
      }
    ]
  },
  {
    id: "v2",
    name: "Olympia Theatre",
    location: "Dublin",
    eventCount: 8,
    lat: 53.344,
    lng: -6.264,
    events: [
      {
        id: "1003",
        title: "Soul Night",
        artist: "John Legend",
        venue: "Olympia Theatre, Dublin",
        date: "June 18, 2025",
        imageUrl: "/placeholder.svg",
        type: "concert" as const,
        category: "listing" as const
      }
    ]
  },
  {
    id: "v3",
    name: "Vicar Street",
    location: "Dublin",
    eventCount: 15,
    lat: 53.338,
    lng: -6.277,
    events: [
      {
        id: "1004",
        title: "Folk Revival",
        artist: "Mumford & Sons",
        venue: "Vicar Street, Dublin",
        date: "May 15, 2025",
        imageUrl: "/placeholder.svg",
        type: "concert" as const,
        category: "listing" as const
      }
    ]
  }
];

const MapPage = () => {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [venueEvents, setVenueEvents] = useState<EventCardProps[]>([]);
  
  // For now, we'll just use a placeholder map
  // In a real implementation, you would integrate with a mapping library like Mapbox or Google Maps
  const handleVenueClick = (venueId: string) => {
    const venue = venues.find(v => v.id === venueId);
    if (venue) {
      setSelectedVenue(venue.name);
      setVenueEvents(venue.events);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Event Map" 
        subtitle="Explore music venues across Ireland and upcoming events"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Map Placeholder - This would be replaced with actual map component */}
          <div className="bg-dark-300 rounded-lg p-4 h-[500px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 mb-4">Venue Map (Placeholder)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {venues.map(venue => (
                  <button
                    key={venue.id}
                    onClick={() => handleVenueClick(venue.id)}
                    className={`p-4 rounded-lg text-left transition-colors ${
                      selectedVenue === venue.name 
                        ? 'bg-white/10 border border-white/20' 
                        : 'bg-dark-200 hover:bg-dark-100'
                    }`}
                  >
                    <h3 className="font-medium text-white">{venue.name}</h3>
                    <p className="text-sm text-gray-400">{venue.location}</p>
                    <div className="mt-2 text-sm">
                      <span className="inline-block px-2 py-1 bg-dark-400 rounded text-gray-300">
                        {venue.eventCount} events
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="sticky top-24">
            <div className="bg-dark-300 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-medium text-white mb-2">Venue Information</h2>
              {selectedVenue ? (
                <div>
                  <h3 className="text-lg font-medium text-white">{selectedVenue}</h3>
                  <p className="text-gray-400 mb-2">
                    {venues.find(v => v.name === selectedVenue)?.eventCount} upcoming events
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">Select a venue on the map to see details</p>
              )}
            </div>
            
            {selectedVenue && venueEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {venueEvents.map(event => (
                    <EventGrid key={`grid-${event.id}`} events={[event]} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
