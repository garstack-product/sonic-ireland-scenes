import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Ticket, Heart, Share2, Globe, Music, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_KEYS } from "@/config/api-keys";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { fetchArtistData, fetchVenueEvents } from "@/services/api";
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
        
        const response = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEYS.TICKETMASTER}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await response.json();
        
        const venue = data._embedded?.venues?.[0] || {};
        const priceRanges = data.priceRanges || [];
        
        let priceDisplay = "";
        if (priceRanges.length > 0) {
          const { min, max, currency } = priceRanges[0];
          priceDisplay = min === max 
            ? `${currency}${min.toFixed(2)}` 
            : `${currency}${min.toFixed(2)} - ${currency}${max.toFixed(2)}`;
        }
        
        const formattedDate = data.dates?.start?.localDate
          ? new Date(data.dates.start.localDate).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
          : "";
          
        const formattedTime = data.dates?.start?.localTime
          ? new Date(`2000-01-01T${data.dates.start.localTime}`).toLocaleTimeString('en-US', {
              hour: 'numeric', 
              minute: '2-digit'
            })
          : "";
          
        const artist = data.name.includes(":") 
          ? data.name.split(":")[0] 
          : data._embedded?.attractions?.[0]?.name || "";
          
        const eventDetail: EventDetail = {
          id: data.id,
          title: data.name,
          artist: artist,
          venue: venue.name || "",
          address: venue.address?.line1,
          city: venue.city?.name,
          date: formattedDate,
          time: formattedTime,
          imageUrl: data.images?.find((img: any) => img.ratio === "16_9" && img.width > 800)?.url 
            || data.images?.[0]?.url 
            || "/placeholder.svg",
          description: data.info || data.pleaseNote || "No additional information available for this event.",
          genre: data.classifications?.[0]?.genre?.name !== "Undefined" ? data.classifications?.[0]?.genre?.name : undefined,
          subgenre: data.classifications?.[0]?.subGenre?.name !== "Undefined" ? data.classifications?.[0]?.subGenre?.name : undefined,
          priceRange: priceDisplay,
          ticketUrl: data.url,
          venueMapUrl: venue?.maps?.seatMap?.staticUrl,
          type: (type === "concert" || type === "festival") ? type : "concert"
        };
        
        setEvent(eventDetail);
        setIsLoading(false);
        
        if (artist) {
          fetchArtistInfo(artist);
        }
        
        if (venue.name) {
          fetchEventsAtVenue(venue.name);
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

  const socialLinks = getSocialLinksFromData(artistData);

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
              src={event.imageUrl} 
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
                      src={`https://www.google.com/maps/embed/v1/place?key=${API_KEYS.GOOGLE_MAPS}&q=${encodeURIComponent(event.venue + (event.city ? ', ' + event.city : ''))}`}
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
