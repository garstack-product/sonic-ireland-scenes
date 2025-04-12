
import { useState, useEffect, useRef } from "react";
import { fetchTicketmasterEvents } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pin, ChevronRight, MapPin } from "lucide-react";
import { API_KEYS } from "@/config/api-keys";
import EventCard, { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";

interface Venue {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  events: EventCardProps[];
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapPage = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showEvents, setShowEvents] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const eventData = await fetchTicketmasterEvents();
        setEvents(eventData);
        
        // Group events by venue and extract venue information
        const venuesMap = new Map<string, Venue>();
        
        eventData.forEach(event => {
          // Extract venue info from the event
          const venueName = event.venue.split(',')[0].trim();
          
          if (!venuesMap.has(venueName)) {
            // Create a new venue entry
            venuesMap.set(venueName, {
              id: `venue-${venueName.toLowerCase().replace(/\s+/g, '-')}`,
              name: venueName,
              city: event.venue.includes(',') ? event.venue.split(',')[1].trim() : 'Dublin',
              // We'll properly geocode these
              latitude: 53.3498, // Default Dublin latitude
              longitude: -6.2603, // Default Dublin longitude
              events: []
            });
          }
          
          // Add event to the venue
          const venue = venuesMap.get(venueName)!;
          venue.events.push(event);
        });
        
        // Convert map to array
        const venuesArray = Array.from(venuesMap.values());
        setVenues(venuesArray);
        setIsLoading(false);
        
        // Load Google Maps API and geocode venues
        loadGoogleMapsAPI();
      } catch (error) {
        console.error("Error loading event data:", error);
        toast.error("Failed to load event data");
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, []);
  
  const loadGoogleMapsAPI = () => {
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = initializeMap;
      
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  };
  
  const initializeMap = () => {
    if (!mapRef.current) return;
    
    const { google } = window;
    
    // Create the map centered on Dublin
    const mapOptions = {
      center: { lat: 53.3498, lng: -6.2603 },
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
    };
    
    googleMapRef.current = new google.maps.Map(mapRef.current, mapOptions);
    
    // Create a geocoder instance
    const geocoder = new google.maps.Geocoder();
    
    // Geocode each venue
    venues.forEach((venue, index) => {
      // Add a slight delay to prevent rate limiting
      setTimeout(() => {
        const address = `${venue.name}, ${venue.city}, Ireland`;
        
        geocoder.geocode({ address }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            
            // Update venue with accurate coordinates
            const updatedVenue = { 
              ...venue, 
              latitude: location.lat(), 
              longitude: location.lng() 
            };
            
            // Update venues array
            setVenues(prev => {
              const newVenues = [...prev];
              newVenues[index] = updatedVenue;
              return newVenues;
            });
            
            // Add marker
            addMarkerToMap(updatedVenue);
          } else {
            console.error(`Geocoding failed for ${address}: ${status}`);
            // Still add marker with default Dublin coordinates
            addMarkerToMap(venue);
          }
        });
      }, index * 200); // Stagger requests
    });
  };
  
  const addMarkerToMap = (venue: Venue) => {
    if (!googleMapRef.current) return;
    
    const { google } = window;
    
    // Custom marker icon
    const markerIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#FF5A5F",
      fillOpacity: 0.9,
      scale: 10,
      strokeColor: "#FFF",
      strokeWeight: 2,
    };
    
    const marker = new google.maps.Marker({
      position: { lat: venue.latitude, lng: venue.longitude },
      map: googleMapRef.current,
      title: venue.name,
      icon: markerIcon,
      animation: google.maps.Animation.DROP,
    });
    
    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="color: #333; padding: 5px; max-width: 200px;">
          <h3 style="margin: 0; padding-bottom: 5px; font-size: 16px;">${venue.name}</h3>
          <p style="margin: 5px 0; font-size: 14px;">${venue.city}</p>
          <p style="margin: 5px 0; font-size: 14px;">${venue.events.length} events</p>
        </div>
      `
    });
    
    // Add click event
    marker.addListener('click', () => {
      // Close other info windows
      markersRef.current.forEach(m => m.infoWindow.close());
      
      // Open this info window
      infoWindow.open(googleMapRef.current, marker);
      
      // Set selected venue
      setSelectedVenue(venue);
      setShowEvents(true);
      
      // Pan to marker
      googleMapRef.current.panTo({ lat: venue.latitude, lng: venue.longitude });
    });
    
    // Save reference
    markersRef.current.push({ marker, infoWindow, venue });
  };
  
  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowEvents(true);
    
    // Find the marker for this venue and trigger its click event
    const markerObj = markersRef.current.find(m => m.venue.id === venue.id);
    if (markerObj && googleMapRef.current) {
      // Close other info windows
      markersRef.current.forEach(m => m.infoWindow.close());
      
      // Open this info window
      markerObj.infoWindow.open(googleMapRef.current, markerObj.marker);
      
      // Pan to marker
      googleMapRef.current.panTo({ 
        lat: venue.latitude, 
        lng: venue.longitude 
      });
      googleMapRef.current.setZoom(14);
    }
  };
  
  const handleBackToVenues = () => {
    setShowEvents(false);
    setSelectedVenue(null);
    
    // Close all info windows
    if (markersRef.current) {
      markersRef.current.forEach(m => m.infoWindow.close());
    }
    
    // Reset map view
    if (googleMapRef.current) {
      googleMapRef.current.setZoom(12);
      googleMapRef.current.setCenter({ lat: 53.3498, lng: -6.2603 });
    }
  };

  return (
    <div>
      <PageHeader 
        title="Event Map" 
        subtitle="Discover events by location across Ireland"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Sidebar */}
        <div className="md:col-span-1 bg-dark-300 p-4 rounded-lg h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : showEvents && selectedVenue ? (
            <div>
              <Button 
                variant="ghost" 
                onClick={handleBackToVenues}
                className="mb-4"
              >
                <ChevronRight className="rotate-180 mr-2" size={16} />
                Back to venues
              </Button>
              
              <h3 className="text-xl text-white font-semibold mb-4">
                Events at {selectedVenue.name}
              </h3>
              
              <div className="space-y-4">
                {selectedVenue.events.map(event => (
                  <Card key={event.id} className="bg-dark-400 border-gray-700">
                    <CardContent className="p-0">
                      <Link to={`/listings/${event.type}/${event.id}`} className="block">
                        <div className="p-4">
                          <h4 className="text-white font-medium mb-1">{event.title}</h4>
                          <p className="text-gray-400 text-sm">{event.artist}</p>
                          <p className="text-gray-400 text-sm mt-1">{event.date}</p>
                          {event.time && (
                            <p className="text-gray-400 text-sm">{event.time}</p>
                          )}
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl text-white font-semibold mb-4">Venues</h3>
              <div className="space-y-2">
                {venues.map(venue => (
                  <Button
                    key={venue.id}
                    variant="ghost"
                    onClick={() => handleVenueClick(venue)}
                    className="w-full justify-start text-left p-3 h-auto"
                  >
                    <div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-rose-500" />
                        <span className="font-medium">{venue.name}</span>
                      </div>
                      <div className="ml-6 text-gray-400 text-sm">
                        {venue.city} • {venue.events.length} events
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Map */}
        <div className="md:col-span-2 bg-dark-300 rounded-lg overflow-hidden h-[70vh]">
          <div ref={mapRef} className="w-full h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
