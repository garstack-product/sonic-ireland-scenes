
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { API_KEYS } from "@/config/api-keys";

// This will be replaced with real data from the Ticketmaster API
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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!document.getElementById('google-maps-script')) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        window.initMap = () => {
          setMapLoaded(true);
        };
      }
    };
    
    loadGoogleMaps();
    
    return () => {
      // Cleanup if needed
      const script = document.getElementById('google-maps-script');
      if (script) {
        script.remove();
      }
    };
  }, []);
  
  useEffect(() => {
    if (mapLoaded && !map) {
      const mapDiv = document.getElementById('map');
      if (mapDiv) {
        const newMap = new google.maps.Map(mapDiv, {
          center: { lat: 53.35, lng: -6.26 }, // Dublin center
          zoom: 12,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#263c3f" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }],
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }],
            },
          ],
        });
        setMap(newMap);
        
        // Add markers for venues
        const newMarkers = venues.map(venue => {
          const marker = new google.maps.Marker({
            position: { lat: venue.lat, lng: venue.lng },
            map: newMap,
            title: venue.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#8B5CF6",
              fillOpacity: 0.8,
              strokeWeight: 1,
              strokeColor: "#FFFFFF",
            }
          });
          
          marker.addListener("click", () => {
            handleVenueClick(venue.id);
          });
          
          return marker;
        });
        
        setMarkers(newMarkers);
      }
    }
  }, [mapLoaded, map]);

  const handleVenueClick = (venueId: string) => {
    const venue = venues.find(v => v.id === venueId);
    if (venue) {
      setSelectedVenue(venue.name);
      setVenueEvents(venue.events);
      
      // Center map on selected venue
      if (map) {
        map.panTo({ lat: venue.lat, lng: venue.lng });
        map.setZoom(14);
      }
      
      // Highlight the selected marker
      markers.forEach(marker => {
        if (marker.getTitle() === venue.name) {
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#D946EF",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          });
        } else {
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#8B5CF6",
            fillOpacity: 0.8,
            strokeWeight: 1,
            strokeColor: "#FFFFFF",
          });
        }
      });
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
          <div id="map" className="bg-dark-300 rounded-lg h-[500px] overflow-hidden">
            {!mapLoaded && (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">Loading map...</p>
              </div>
            )}
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
