
import { useState, useEffect, useRef } from "react";
import { fetchAllEvents } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";
import EventCard, { EventCardProps } from "@/components/ui/EventCard";

interface Venue {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  eventCount: number;
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
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const eventData = await fetchAllEvents();
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
              eventCount: 0,
              events: []
            });
          }
          
          // Add event to the venue
          const venue = venuesMap.get(venueName)!;
          venue.events.push(event);
          venue.eventCount += 1;
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${window.API_KEYS?.googleMaps}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = initializeMap;
      
      document.head.appendChild(script);
    } else if (!mapInitialized) {
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
    setMapInitialized(true);
    
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
            addMarkerToMap(updatedVenue, false);
          } else {
            // Try to geocode with just the venue and country if city fails
            geocoder.geocode({ address: `${venue.name}, Ireland` }, (resultsRetry: any, statusRetry: any) => {
              if (statusRetry === 'OK' && resultsRetry[0]) {
                const location = resultsRetry[0].geometry.location;
                
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
                addMarkerToMap(updatedVenue, false);
              } else {
                console.error(`Geocoding failed for ${address}: ${status}`);
                // Still add marker with default Dublin coordinates
                addMarkerToMap(venue, false);
              }
            });
          }
        });
      }, index * 200); // Stagger requests
    });
  };
  
  const calculateMarkerSize = (eventCount: number) => {
    // Base size for venues with 1 event
    const baseSize = 10;
    
    // Find maximum events for any venue to normalize
    const maxEvents = Math.max(...venues.map(v => v.eventCount), 1);
    
    // Calculate size based on event count (min 10, max 30)
    return Math.min(Math.max(baseSize + (eventCount / maxEvents) * 20, baseSize), 30);
  };
  
  const addMarkerToMap = (venue: Venue, isSelected: boolean) => {
    if (!googleMapRef.current) return;
    
    const { google } = window;
    
    // Remove existing marker for this venue if any
    const existingMarkerIndex = markersRef.current.findIndex(m => m.venue.id === venue.id);
    if (existingMarkerIndex !== -1) {
      markersRef.current[existingMarkerIndex].marker.setMap(null);
      markersRef.current[existingMarkerIndex].infoWindow.close();
      markersRef.current.splice(existingMarkerIndex, 1);
    }
    
    // Calculate marker size based on number of events
    const markerSize = calculateMarkerSize(venue.eventCount);
    
    // Custom marker icon based on selection status and event count
    const markerIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: isSelected ? "#FF0000" : "#FF5A5F",
      fillOpacity: 0.9,
      scale: isSelected ? markerSize * 1.2 : markerSize,
      strokeColor: "#FFF",
      strokeWeight: 2,
    };
    
    const marker = new google.maps.Marker({
      position: { lat: venue.latitude, lng: venue.longitude },
      map: googleMapRef.current,
      title: venue.name,
      icon: markerIcon,
      animation: isSelected ? google.maps.Animation.BOUNCE : google.maps.Animation.DROP,
      label: {
        text: venue.eventCount.toString(),
        color: "#FFFFFF",
        fontSize: "10px",
        fontWeight: "bold"
      }
    });
    
    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="color: #333; padding: 5px; max-width: 200px;">
          <h3 style="margin: 0; padding-bottom: 5px; font-size: 16px;">${venue.name}</h3>
          <p style="margin: 5px 0; font-size: 14px;">${venue.city}</p>
          <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${venue.eventCount} events</p>
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
      
      // Update marker appearance
      markersRef.current.forEach(m => {
        if (m.venue.id === venue.id) {
          // Update to selected style
          m.marker.setIcon({
            ...markerIcon,
            fillColor: "#FF0000",
            scale: markerSize * 1.2
          });
          m.marker.setAnimation(google.maps.Animation.BOUNCE);
        } else {
          // Reset others to default style
          const otherSize = calculateMarkerSize(m.venue.eventCount);
          m.marker.setIcon({
            ...markerIcon,
            fillColor: "#FF5A5F",
            scale: otherSize
          });
          m.marker.setAnimation(null);
        }
      });
      
      // Pan to marker
      googleMapRef.current.panTo({ lat: venue.latitude, lng: venue.longitude });
      googleMapRef.current.setZoom(14);
    });
    
    // Save reference
    markersRef.current.push({ marker, infoWindow, venue });
  };
  
  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowEvents(true);
    
    // Update all markers to reset their styles
    if (markersRef.current.length > 0 && googleMapRef.current) {
      markersRef.current.forEach(m => {
        // Reset all markers
        const { google } = window;
        addMarkerToMap(m.venue, m.venue.id === venue.id);
      });
      
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
    }
  };
  
  const handleBackToVenues = () => {
    setShowEvents(false);
    setSelectedVenue(null);
    
    // Reset all markers
    if (markersRef.current.length > 0) {
      const { google } = window;
      markersRef.current.forEach(m => {
        m.infoWindow.close();
        const markerSize = calculateMarkerSize(m.venue.eventCount);
        m.marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#FF5A5F",
          fillOpacity: 0.9,
          scale: markerSize,
          strokeColor: "#FFF",
          strokeWeight: 2,
        });
        m.marker.setAnimation(null);
      });
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
              
              <h3 className="text-xl text-white font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 text-rose-500" size={20} />
                Events at {selectedVenue.name}
                <span className="ml-2 text-sm bg-rose-500 text-white px-2 py-0.5 rounded-full">
                  {selectedVenue.events.length}
                </span>
              </h3>
              
              <div className="space-y-4 w-full">
                {selectedVenue.events.map(event => (
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
          ) : (
            <div>
              <h3 className="text-xl text-white font-semibold mb-4">Venues</h3>
              <div className="space-y-2">
                {venues
                  .sort((a, b) => b.eventCount - a.eventCount) // Sort by event count
                  .map(venue => (
                  <Button
                    key={venue.id}
                    variant="ghost"
                    onClick={() => handleVenueClick(venue)}
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
