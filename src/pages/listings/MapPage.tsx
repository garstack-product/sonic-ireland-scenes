import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { API_KEYS } from "@/config/api-keys";
import { toast } from "sonner";
import ticketmasterEvents from "@/config/ticketmaster-events.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Venue {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  events: EventCardProps[];
  eventCount: number;
  accessibility?: string;
  address?: string;
}

const MapPage = () => {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [venueEvents, setVenueEvents] = useState<EventCardProps[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueDetails, setVenueDetails] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    const venueMap = new Map<string, Venue>();
    const eventsData = ticketmasterEvents.events || [];
    
    eventsData.forEach((event: any) => {
      if (!event._embedded?.venues?.[0]) return;
      
      const venue = event._embedded.venues[0];
      const venueName = venue.name || "";
      
      if (!venueName) return;
      
      const lat = parseFloat(venue.location?.latitude) || 0;
      const lng = parseFloat(venue.location?.longitude) || 0;
      
      if (lat === 0 && lng === 0) return;
      
      const eventData: EventCardProps = {
        id: event.id,
        title: event.name,
        artist: event.name.includes(":") ? event.name.split(":")[0] : event._embedded?.attractions?.[0]?.name || "",
        venue: `${venueName}, ${venue.city?.name || ""}`,
        date: event.dates?.start?.localDate 
          ? new Date(event.dates.start.localDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : "",
        time: event.dates?.start?.localTime 
          ? new Date(`2000-01-01T${event.dates.start.localTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : undefined,
        imageUrl: event.images?.find((img: any) => img.ratio === "16_9" && img.width > 500)?.url 
          || event.images?.[0]?.url 
          || "/placeholder.svg",
        type: "concert" as const,
        category: "listing" as const,
        genre: event.classifications?.[0]?.genre?.name !== "Undefined" ? event.classifications?.[0]?.genre?.name : undefined,
        subgenre: event.classifications?.[0]?.subGenre?.name !== "Undefined" ? event.classifications?.[0]?.subGenre?.name : undefined,
        price: event.priceRanges?.[0]?.min || 0,
        ticketUrl: event.url || undefined
      };
      
      if (venueMap.has(venueName)) {
        const existingVenue = venueMap.get(venueName)!;
        existingVenue.events.push(eventData);
        existingVenue.eventCount++;
      } else {
        venueMap.set(venueName, {
          id: venue.id || `venue-${venueMap.size}`,
          name: venueName,
          location: venue.city?.name || "",
          lat,
          lng,
          events: [eventData],
          eventCount: 1,
          accessibility: venue.accessibleSeatingDetail,
          address: venue.address?.line1
        });
      }
    });
    
    const venueArray = Array.from(venueMap.values());
    setVenues(venueArray);
    setIsLoading(false);
  }, []);
  
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
      const script = document.getElementById('google-maps-script');
      if (script) {
        script.remove();
      }
    };
  }, []);
  
  useEffect(() => {
    if (mapLoaded && !map && venues.length > 0) {
      const mapDiv = document.getElementById('map');
      if (mapDiv) {
        const center = venues.length > 0 
          ? { lat: venues[0].lat, lng: venues[0].lng } 
          : { lat: 53.35, lng: -6.26 }; // Dublin center as fallback
        
        const newMap = new google.maps.Map(mapDiv, {
          center,
          zoom: 10,
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
        
        const newMarkers = venues.map(venue => {
          let fillColor = '#4ADE80';
          let scale = 10;
          
          if (venue.eventCount > 10) {
            fillColor = '#DC2626';
            scale = 14;
          } else if (venue.eventCount > 5) {
            fillColor = '#F97316';
            scale = 12;
          } else if (venue.eventCount > 2) {
            fillColor = '#FBBF24';
            scale = 11;
          }
          
          const marker = new google.maps.Marker({
            position: { lat: venue.lat, lng: venue.lng },
            map: newMap,
            title: `${venue.name} (${venue.eventCount} events)`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale,
              fillColor,
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
  }, [mapLoaded, map, venues]);

  const handleVenueClick = (venueId: string) => {
    const venue = venues.find(v => v.id === venueId);
    if (venue) {
      setSelectedVenue(venue.name);
      setVenueEvents(venue.events);
      setVenueDetails(venue);
      
      if (map) {
        map.panTo({ lat: venue.lat, lng: venue.lng });
        map.setZoom(14);
      }
      
      markers.forEach(marker => {
        if (marker.getTitle()?.includes(venue.name)) {
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#D946EF",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          });
        } else {
          const markerVenue = venues.find(v => marker.getTitle()?.includes(v.name));
          if (markerVenue) {
            let fillColor = '#4ADE80';
            let scale = 10;
            
            if (markerVenue.eventCount > 10) {
              fillColor = '#DC2626';
              scale = 14;
            } else if (markerVenue.eventCount > 5) {
              fillColor = '#F97316';
              scale = 12;
            } else if (markerVenue.eventCount > 2) {
              fillColor = '#FBBF24';
              scale = 11;
            }
            
            marker.setIcon({
              path: google.maps.SymbolPath.CIRCLE,
              scale,
              fillColor,
              fillOpacity: 0.8,
              strokeWeight: 1,
              strokeColor: "#FFFFFF",
            });
          }
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
          <div id="map" className="bg-dark-300 rounded-lg h-[600px] overflow-hidden">
            {isLoading || !mapLoaded ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">Loading map...</p>
              </div>
            ) : null}
          </div>
        </div>
        
        <div>
          <div className="sticky top-24">
            <div className="bg-dark-300 rounded-lg p-4 mb-4 h-[350px] overflow-y-auto">
              <h2 className="text-xl font-medium text-white mb-2">Venue Information</h2>
              {selectedVenue && venueDetails ? (
                <div>
                  <h3 className="text-lg font-medium text-white">{venueDetails.name}</h3>
                  <p className="text-gray-400 mb-2">
                    {venueDetails.eventCount} upcoming events
                  </p>
                  {venueDetails.address && (
                    <p className="text-gray-400 mb-2">
                      <span className="font-semibold">Address:</span> {venueDetails.address}
                    </p>
                  )}
                  {venueDetails.location && (
                    <p className="text-gray-400 mb-2">
                      <span className="font-semibold">Location:</span> {venueDetails.location}
                    </p>
                  )}
                  {venueDetails.accessibility && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-white mb-1">Accessibility</h4>
                      <p className="text-gray-400 text-sm">{venueDetails.accessibility}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">Select a venue on the map to see details</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {selectedVenue && venueEvents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-white mb-4">Upcoming Events at {selectedVenue}</h3>
          <Carousel className="w-full">
            <CarouselContent>
              {venueEvents.map((event) => (
                <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1">
                    <EventGrid events={[event]} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default MapPage;
