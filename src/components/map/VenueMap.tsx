
import React, { useEffect, useRef } from "react";
import { Venue } from "@/types/venue";
import { MapMarkerReference } from "@/types/venue";

interface VenueMapProps {
  venues: Venue[];
  selectedVenue: Venue | null;
  onVenueSelect: (venue: Venue) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const VenueMap = ({ venues, selectedVenue, onVenueSelect }: VenueMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<MapMarkerReference[]>([]);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current || venues.length === 0) return;
    
    if (!window.google) {
      window.initMap = () => initializeMap();
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${window.API_KEYS?.googleMaps}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      return;
    }
    
    initializeMap();
  }, [venues]);

  // Update markers when venues or selectedVenue changes
  useEffect(() => {
    if (!googleMapRef.current || venues.length === 0) return;
    
    // Clear existing markers
    markersRef.current.forEach(m => {
      m.marker.setMap(null);
      m.infoWindow.close();
    });
    markersRef.current = [];
    
    // Add markers for all venues
    venues.forEach(venue => {
      addMarkerToMap(venue, venue.id === selectedVenue?.id);
    });
    
    // If there's a selected venue, focus on it
    if (selectedVenue) {
      const markerObj = markersRef.current.find(m => m.venue.id === selectedVenue.id);
      if (markerObj) {
        markerObj.infoWindow.open(googleMapRef.current, markerObj.marker);
        googleMapRef.current.panTo({ lat: selectedVenue.latitude, lng: selectedVenue.longitude });
        googleMapRef.current.setZoom(14);
      }
    } else {
      // Reset view if no venue is selected
      googleMapRef.current.setZoom(12);
      googleMapRef.current.setCenter({ lat: 53.3498, lng: -6.2603 });
    }
  }, [venues, selectedVenue]);

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
    
    // Add markers for all venues
    venues.forEach(venue => {
      addMarkerToMap(venue, venue.id === selectedVenue?.id);
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
      
      // Notify parent component that venue was selected
      onVenueSelect(venue);
    });
    
    // Save reference
    markersRef.current.push({ marker, infoWindow, venue });
  };

  return (
    <div ref={mapRef} className="w-full h-full"></div>
  );
};

export default VenueMap;
