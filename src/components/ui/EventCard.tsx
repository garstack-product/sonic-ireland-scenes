import { Link } from "react-router-dom";
import { Heart, Ticket, Euro } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ShareMenu from "../events/ShareMenu";
import EventTags from "../events/EventTags";

export interface EventCardProps {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  time?: string;
  imageUrl: string;
  type: "concert" | "festival";
  category: "listing" | "review";
  genre?: string;
  subgenre?: string;
  price?: number;
  maxPrice?: number;
  ticketUrl?: string;
  rawDate?: string;
  onSaleDate?: string | null;
  source?: string;
  venue_id?: string;
  is_featured?: boolean;
  is_hidden?: boolean;
  rawData?: any;
}

const EventCard = ({ 
  id, 
  title, 
  artist, 
  venue, 
  date, 
  time, 
  imageUrl, 
  type, 
  category,
  genre,
  subgenre,
  price,
  maxPrice,
  ticketUrl
}: EventCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { user, likeEvent, unlikeEvent, isEventLiked } = useAuth();
  
  const basePath = category === "review" ? "reviews" : "listings";
  const detailPath = `/${basePath}/${type}/${id}`;
  
  useEffect(() => {
    if (user && id) {
      setIsLiked(isEventLiked(id));
    }
  }, [user, id, isEventLiked]);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please log in to like events");
      return;
    }
    
    if (isLiked) {
      unlikeEvent(id);
      setIsLiked(false);
      toast.success(`Removed ${title} from your liked events`);
    } else {
      likeEvent(id);
      setIsLiked(true);
      toast.success(`Added ${title} to your liked events`);
    }
  };

  const renderPrice = () => {
    if (price === undefined || price === null) {
      return null;
    }
    return (
      <div className="mt-1 flex items-center text-gray-400">
        {maxPrice && maxPrice > price ? (
          <>
            <span className="mr-1">From</span><span>€{price.toFixed(2)}</span>
            <span className="mx-1">-</span>
            <span>€{maxPrice.toFixed(2)}</span>
          </>
        ) : (
          <>
            <span className="mr-1">From</span><span>€{price.toFixed(2)}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="group relative bg-dark-300 rounded-lg overflow-hidden shadow-md hover-effect">
      <Link to={detailPath}>
        <div className="aspect-[3/2] overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          
          <EventTags genre={genre} subgenre={subgenre} type={type} />
          
          <button 
            onClick={handleToggleLike}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm
              ${isLiked ? 'bg-red-500/90 text-white' : 'bg-dark-500/80 text-white hover:bg-red-500/80'}`}
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart size={18} className={isLiked ? "fill-white" : ""} />
          </button>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link to={detailPath}>
              <h3 className="text-lg font-medium text-white line-clamp-2 group-hover:text-gray-300 transition-colors min-h-[3.5rem]">
                {title}
              </h3>
            </Link>
            <p className="text-gray-400 text-sm">{artist}</p>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-400">
          <div>{venue}</div>
          <div className="mt-1">{date}</div>
          {time && <div className="mt-0.5">{time}</div>}
          {renderPrice()}
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <ShareMenu 
            title={title}
            artist={artist}
            type={type}
            detailPath={detailPath}
          />
          
          {category === "listing" && ticketUrl && (
            <a 
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#ea384c] transition-colors"
              aria-label="Buy tickets"
              title="Buy tickets"
              onClick={(e) => e.stopPropagation()}
            >
              <Ticket size={16} className="hover:fill-[#ea384c]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
