import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Ticket, Heart, Share2, Globe, Music, ExternalLink, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { fetchArtistData, fetchVenueEvents, fetchTicketmasterEvent } from "@/services/api";
import SocialIcons, { getSocialLinksFromData } from "@/components/ui/SocialIcons";
import SocialShareButtons from "@/components/ui/SocialShareButtons";

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
        
        const eventDetail: EventDetail = {
          id: eventData.id,
          title: eventData.title,
          artist: eventData.artist,
          venue: eventData.venue.split(',')[0] || "",
          city: eventData.venue.includes(',') ? eventData.venue.split(',')[1].trim() : undefined,
          date: eventData.date,
          time: eventData.time,
          imageUrl: eventData.imageUrl,
          description: "This event is brought to you by Ticketmaster. See more details on their website.",
          genre: eventData.genre,
          subgenre: eventData.subgenre,
          priceRange: eventData.price ? `€${eventData.price.toFixed(2)}` : undefined,
          ticketUrl: eventData.ticketUrl,
          type: (type === "concert" || type === "festival") ? type : "concert"
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
    const venueImageUrl = 
      artistData?.venue_image || 
      event?.rawData?.images?.find((img: any) => img.ratio === '16_9')?.url || 
      (event?.artist ? `/artist-images/${event.artist.toLowerCase().replace(/\s+/g, '-')}.jpg` : null) || 
      '/placeholder.svg';

    return venueImageUrl;
  };

  const socialLinks = getSocialLinksFromData(artistData);

  const getSocialIcons = () => {
    if (!artistData?.artist_links) return null;

    const links = [
      { 
        name: 'Website', 
        url: artistData.artist_links.homepage, 
        icon: <Globe className="h-5 w-5" />,
        color: '#4a5568'
      },
      { 
        name: 'Facebook', 
        url: artistData.artist_links.facebook, 
        icon: <Facebook className="h-5 w-5" />,
        color: '#1877F2'
      },
      { 
        name: 'Instagram', 
        url: artistData.artist_links.instagram, 
        icon: <Instagram className="h-5 w-5" />,
        color: '#E1306C'
      },
      { 
        name: 'Twitter', 
        url: artistData.artist_links.twitter, 
        icon: <Twitter className="h-5 w-5" />,
        color: '#1DA1F2'
      },
      { 
        name: 'Spotify', 
        url: artistData.artist_links.spotify, 
        icon: <Music className="h-5 w-5" />,
        color: '#1DB954'
      },
      { 
        name: 'iTunes', 
        url: artistData.artist_links.itunes, 
        icon: <Music className="h-5 w-5" />,
        color: '#EA4CC0'
      }
    ].filter(link => link.url);

    return (
      <div className="flex space-x-4 mt-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 bg-dark-400 hover:bg-dark-300 transition-colors"
            style={{ color: link.color }}
          >
            {link.icon}
          </a>
        ))}
      </div>
    );
  };

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8">
            <div className="md:col-span-3">
              <h3 className="text-2xl text-white font-semibold mb-6">Artist Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img 
                      src={artistData?.imageUrl || event.imageUrl} 
                      alt={event.artist} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  
                  {socialLinks.length > 0 && (
                    <SocialIcons links={socialLinks} />
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <div className="mb-6">
                    <h4 className="text-lg text-white font-medium mb-3">{event.artist}</h4>
                    <p className="text-gray-300">
                      {isLoadingArtist ? "Loading artist information..." : (artistData?.bio || "No artist bio available.")}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    
                    {event.time && (
                      <div className="flex items-center text-gray-300">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg text-white font-semibold mb-3">About This Event</h4>
                    <p className="text-gray-300 whitespace-pre-line">{event.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {event.ticketUrl && (
                      <Button 
                        className="flex items-center justify-center gap-2 bg-white text-dark-500 hover:bg-gray-200"
                        onClick={() => window.open(event.ticketUrl, '_blank')}
                      >
                        <Ticket size={18} />
                        Buy Tickets
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className={`flex items-center justify-center gap-2 ${
                        liked ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' : 'border-white'
                      }`}
                      onClick={handleLike}
                    >
                      <Heart size={18} className={liked ? "fill-white" : ""} />
                      {liked ? 'Saved' : 'Save Event'}
                    </Button>
                    
                    <SocialShareButtons 
                      title={event.title} 
                      url={window.location.href} 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3 mt-8">
              <h3 className="text-2xl text-white font-semibold mb-6">Venue Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-dark-400 p-6 rounded-lg">
                  <h4 className="text-lg text-white font-medium mb-4">{event.venue}</h4>
                  {event.address && <p className="text-gray-300 mb-2">{event.address}</p>}
                  {event.city && <p className="text-gray-300 mb-4">{event.city}</p>}
                  
                  {event.venueMapUrl && (
                    <img 
                      src={event.venueMapUrl} 
                      alt={`Seating chart for ${event.venue}`} 
                      className="rounded-lg w-full mt-4"
                    />
                  )}
                  
                  {event.priceRange && (
                    <div className="mt-6">
                      <h5 className="text-white font-medium mb-2">Ticket Price</h5>
                      <p className="text-gray-300">{event.priceRange}</p>
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <div className="bg-dark-400 rounded-lg overflow-hidden h-80">
                    <iframe
                      title="Venue Location"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=${window.API_KEYS?.googleMaps}&q=${encodeURIComponent(event.venue + (event.city ? ', ' + event.city : ''))}`}
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
            
            {venueEvents.length > 0 && (
              <div className="md:col-span-3 mt-8">
                <h3 className="text-2xl text-white font-semibold mb-6">More Events at {event.venue}</h3>
                
                {isLoadingVenueEvents ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <EventGrid events={venueEvents} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
