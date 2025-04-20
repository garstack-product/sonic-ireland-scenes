import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Ticket, Heart, Share2, Globe, Music, ExternalLink, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { fetchArtistData, fetchVenueEvents, fetchTicketmasterEvent } from "@/services/api";
import SocialIcons from "@/components/ui/SocialIcons";
import SocialShareButtons from "@/components/ui/SocialShareButtons";
import ArtistInfoSection from "@/components/events/ArtistInfoSection";
import VenueInfoSection from "@/components/events/VenueInfoSection";
import EventSocialIconsRow from "@/components/events/EventSocialIconsRow";

interface EventDetail {
  id: string;
  title: string;
  artist: string;
  venue: string;
  address?: string;
  city?: string;
  date: string;
  time?: string;
  imageUrl: string;
  description?: string;
  genre?: string;
  subgenre?: string;
  priceRange?: string;
  ticketUrl?: string;
  venueMapUrl?: string;
  type: "concert" | "festival";
  rawData?: any;
  venueData?: any;
}

const EventDetailPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, likeEvent, unlikeEvent, isEventLiked } = useAuth();
  const [liked, setLiked] = useState(false);
  const [venueEvents, setVenueEvents] = useState<EventCardProps[]>([]);
  const [artistData, setArtistData] = useState<any>(null);
  const [isLoadingArtist, setIsLoadingArtist] = useState(false);
  const [isLoadingVenueEvents, setIsLoadingVenueEvents] = useState(false);

  useEffect(() => {
    if (user && id) {
      setLiked(isEventLiked(id));
    }
  }, [user, id, isEventLiked]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        
        if (!id) {
          throw new Error("Event ID is missing");
        }
        
        const eventData = await fetchTicketmasterEvent(id);
        
        if (!eventData) {
          throw new Error("Failed to fetch event details");
        }
        
        const venueInfo = eventData.rawData?._embedded?.venues?.[0] || {};
        
        const eventDetail: EventDetail = {
          id: eventData.id,
          title: eventData.title,
          artist: eventData.artist,
          venue: eventData.venue.split(',')[0] || "",
          city: eventData.venue.includes(',') ? eventData.venue.split(',')[1].trim() : undefined,
          date: eventData.date,
          time: eventData.time,
          imageUrl: eventData.imageUrl,
          description: eventData.rawData?.info || "This event is brought to you by Ticketmaster. See more details on their website.",
          genre: eventData.genre,
          subgenre: eventData.subgenre,
          priceRange: eventData.price ? `€${eventData.price.toFixed(2)}` : undefined,
          ticketUrl: eventData.ticketUrl,
          type: (type === "concert" || type === "festival") ? type : "concert",
          rawData: eventData.rawData,
          venueData: venueInfo,
          address: venueInfo?.address?.line1,
        };
        
        setEvent(eventDetail);
        setIsLoading(false);
        
        if (eventData.artist) {
          fetchArtistInfo(eventData.artist);
        }
        
        if (eventData.venue) {
          fetchEventsAtVenue(eventData.venue.split(',')[0]);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to load event details. Please try again later.");
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchEventDetails();
    }
  }, [id, type]);

  const fetchArtistInfo = async (artistName: string) => {
    try {
      setIsLoadingArtist(true);
      const data = await fetchArtistData(artistName);
      setArtistData(data);
    } catch (error) {
      console.error("Error fetching artist data:", error);
    } finally {
      setIsLoadingArtist(false);
    }
  };

  const fetchEventsAtVenue = async (venueName: string) => {
    try {
      setIsLoadingVenueEvents(true);
      const events = await fetchVenueEvents(venueName);
      const otherEvents = events.filter(evt => evt.id !== id);
      setVenueEvents(otherEvents.slice(0, 4));
    } catch (error) {
      console.error(`Error fetching events for venue ${venueName}:`, error);
    } finally {
      setIsLoadingVenueEvents(false);
    }
  };

  const handleLike = () => {
    if (!user) {
      toast.error("Please log in to like events");
      return;
    }
    
    if (liked) {
      unlikeEvent(id!);
    } else {
      likeEvent(id!);
    }
    
    setLiked(!liked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out ${event?.title} at ${event?.venue}`,
        url: window.location.href
      }).catch(err => {
        console.error('Failed to share', err);
        handleCopyLink();
      });
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const getEventImage = () => {
    if (!event) return '/placeholder.svg';
    
    // Try to get the best quality artist image
    const artistImage = event.rawData?._embedded?.attractions?.[0]?.images?.find(
      (img: any) => img.ratio === '16_9' && img.width > 1024
    )?.url;
    
    if (artistImage) return artistImage;
    
    // Fallback to event images
    const eventImage = event.rawData?.images?.find(
      (img: any) => img.ratio === '16_9' && img.width > 1024
    )?.url;
    
    if (eventImage) return eventImage;
    
    // Final fallback
    return event.imageUrl || '/placeholder.svg';
  };

  const getSocialLinks = () => {
    if (!event?.rawData?._embedded?.attractions?.[0]?.externalLinks) return [];
    const links = event.rawData._embedded.attractions[0].externalLinks;
    return [
      { name: 'Homepage', url: links.homepage?.[0]?.url, icon: <Globe className="h-5 w-5" />, color: '#4a5568' },
      { name: 'Facebook', url: links.facebook?.[0]?.url, icon: <Facebook className="h-5 w-5" />, color: '#1877F2' },
      { name: 'Twitter', url: links.twitter?.[0]?.url, icon: <Twitter className="h-5 w-5" />, color: '#1DA1F2' },
      { name: 'Instagram', url: links.instagram?.[0]?.url, icon: <Instagram className="h-5 w-5" />, color: '#E1306C' },
      { name: 'Spotify', url: links.spotify?.[0]?.url, icon: <Music className="h-5 w-5" />, color: '#1DB954' },
      { name: 'YouTube', url: links.youtube?.[0]?.url, icon: <Youtube className="h-5 w-5" />, color: '#FF0000' }
    ].filter(link => link.url);
  };
  const eventSocialLinks = getSocialLinks();

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-semibold text-white mb-4">Event Not Found</h2>
        <p className="text-gray-400">The event you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const venueData = event.venueData || {};

  return (
    <div className="bg-dark-400 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-dark-300 rounded-lg overflow-hidden shadow-lg">
          <div className="h-[30vh] md:h-[40vh] relative">
            <img
              src={getEventImage()}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-300 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <div className="flex flex-wrap gap-2 mb-4">
                {event.genre && (
                  <span className="bg-dark-500/90 text-white px-3 py-1 rounded-full text-sm">
                    {event.genre}
                  </span>
                )}
                {event.subgenre && (
                  <span className="bg-dark-500/90 text-white px-3 py-1 rounded-full text-sm">
                    {event.subgenre}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-300 mb-4">{event.artist}</h2>
            </div>
          </div>
          <EventSocialIconsRow links={eventSocialLinks} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8">
            <div className="md:col-span-3">
              <ArtistInfoSection
                event={event}
                artistData={artistData}
                isLoadingArtist={isLoadingArtist}
                liked={liked}
                handleLike={handleLike}
              />
            </div>
            <div className="md:col-span-3 mt-8">
              <VenueInfoSection
                event={event}
                venueData={venueData}
                isLoadingVenueEvents={isLoadingVenueEvents}
                venueEvents={venueEvents}
                EventGrid={EventGrid}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
