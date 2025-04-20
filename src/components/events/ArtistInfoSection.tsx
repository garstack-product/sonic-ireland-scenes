
import React from "react";
import SocialIcons from "@/components/ui/SocialIcons";
import { Calendar, Clock, MapPin, Ticket, Heart, Globe, Twitter, Facebook, Instagram, Music, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialShareButtons from "@/components/ui/SocialShareButtons";

interface ArtistInfoSectionProps {
  event: any;
  artistData: any;
  isLoadingArtist: boolean;
  liked: boolean;
  handleLike: () => void;
}

const ArtistInfoSection: React.FC<ArtistInfoSectionProps> = ({
  event,
  artistData,
  isLoadingArtist,
  liked,
  handleLike,
}) => {
  // Social links for artist from Ticketmaster API
  const links = (() => {
    const raw = event?.rawData?._embedded?.attractions?.[0]?.externalLinks;
    if (!raw) return [];
    
    return [
      { name: "Homepage", url: raw.homepage?.[0]?.url, icon: <Globe size={20} />, color: "#4a5568" },
      { name: "Facebook", url: raw.facebook?.[0]?.url, icon: <Facebook size={20} />, color: "#1877F2" },
      { name: "Twitter", url: raw.twitter?.[0]?.url, icon: <Twitter size={20} />, color: "#1DA1F2" },
      { name: "Instagram", url: raw.instagram?.[0]?.url, icon: <Instagram size={20} />, color: "#E1306C" },
      { name: "Spotify", url: raw.spotify?.[0]?.url, icon: <Music size={20} />, color: "#1DB954" },
      { name: "YouTube", url: raw.youtube?.[0]?.url, icon: <Youtube size={20} />, color: "#FF0000" },
      { name: "iTunes", url: raw.itunes?.[0]?.url, icon: <Music size={20} />, color: "#EA4CC0" },
      { name: "Last.fm", url: raw.lastfm?.[0]?.url, icon: <ExternalLink size={20} />, color: "#D51007" },
      { name: "Wiki", url: raw.wiki?.[0]?.url, icon: <ExternalLink size={20} />, color: "#000000" }
    ].filter(link => link.url);
  })();

  return (
    <div>
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
          {links.length > 0 && <SocialIcons links={links} />}
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
                onClick={() => window.open(event.ticketUrl, "_blank")}
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
  );
};

export default ArtistInfoSection;
