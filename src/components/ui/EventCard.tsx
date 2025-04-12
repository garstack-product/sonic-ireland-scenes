
import { Link } from "react-router-dom";
import { Copy, Heart, Facebook, Twitter, Ticket, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  ticketUrl?: string; // Added ticket URL
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
  ticketUrl
}: EventCardProps) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const basePath = category === "review" ? "reviews" : "listings";
  const detailPath = `/${basePath}/${type}/${id}`;
  
  const handleCopyLink = () => {
    const url = `${window.location.origin}${detailPath}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
    setShowShareMenu(false);
  };
  
  const handleShare = (platform: string) => {
    const url = `${window.location.origin}${detailPath}`;
    const text = `Check out this ${type}: ${title} by ${artist}`;
    
    let shareUrl = "";
    
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    } else if (platform === "whatsapp") {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    }
    
    window.open(shareUrl, "_blank");
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    
    // This is a placeholder - in a real app this would save to user profile
    if (!isLiked) {
      toast.success(`Added ${title} to your liked events`);
    } else {
      toast.success(`Removed ${title} from your liked events`);
    }
  };

  return (
    <div className="group relative bg-dark-300 rounded-lg overflow-hidden shadow-md hover-effect">
      <Link to={detailPath} target="_blank" rel="noopener noreferrer">
        <div className="aspect-[3/2] overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          
          {(genre || subgenre) && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {genre && (
                <Link 
                  to={`/listings/${type}?genre=${encodeURIComponent(genre)}`}
                  className="px-2 py-1 text-xs font-medium bg-dark-500/80 text-white rounded backdrop-blur-sm hover:bg-dark-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  {genre}
                </Link>
              )}
              {subgenre && (
                <Link 
                  to={`/listings/${type}?subgenre=${encodeURIComponent(subgenre)}`}
                  className="px-2 py-1 text-xs font-medium bg-dark-500/80 text-white rounded backdrop-blur-sm hover:bg-dark-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  {subgenre}
                </Link>
              )}
            </div>
          )}
          
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
            <Link to={detailPath} target="_blank" rel="noopener noreferrer">
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
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={() => handleShare("facebook")}
              className="text-gray-400 hover:text-[#1877F2] hover:fill-[#1877F2] transition-colors"
              aria-label="Share on Facebook"
              title="Share on Facebook"
            >
              <Facebook size={16} className="hover:fill-[#1877F2]" />
            </button>
            <button 
              onClick={() => handleShare("twitter")}
              className="text-gray-400 hover:text-[#1DA1F2] hover:fill-[#1DA1F2] transition-colors"
              aria-label="Share on X"
              title="Share on X"
            >
              <Twitter size={16} className="hover:fill-[#1DA1F2]" />
            </button>
            <button 
              onClick={() => handleShare("whatsapp")}
              className="text-gray-400 hover:text-[#25D366] hover:fill-[#25D366] transition-colors"
              aria-label="Share on WhatsApp"
              title="Share on WhatsApp"
            >
              <Smartphone size={16} className="hover:fill-[#25D366]" />
            </button>
            <button 
              onClick={handleCopyLink}
              className="text-gray-400 hover:text-[#9b87f5] hover:fill-[#9b87f5] transition-colors"
              aria-label="Copy Link"
              title="Copy Link"
            >
              <Copy size={16} className="hover:fill-[#9b87f5]" />
            </button>
          </div>
          
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
