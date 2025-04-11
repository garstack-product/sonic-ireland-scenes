
import { Link } from "react-router-dom";
import { Copy, Share2, Facebook, Twitter, Ticket } from "lucide-react";
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
}

const EventCard = ({ id, title, artist, venue, date, time, imageUrl, type, category }: EventCardProps) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  
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
    }
    
    window.open(shareUrl, "_blank");
    setShowShareMenu(false);
  };

  return (
    <div className="group relative bg-dark-300 rounded-lg overflow-hidden shadow-md hover-effect">
      <Link to={detailPath} target="_blank" rel="noopener noreferrer">
        <div className="aspect-[3/2] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link to={detailPath} target="_blank" rel="noopener noreferrer">
              <h3 className="text-lg font-medium text-white truncate group-hover:text-gray-300 transition-colors">
                {title}
              </h3>
            </Link>
            <p className="text-gray-400 text-sm">{artist}</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)} 
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Share options"
            >
              <Share2 size={18} />
            </button>
            
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-md shadow-lg bg-dark-200 ring-1 ring-black ring-opacity-5 py-1 z-10">
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-dark-100"
                >
                  <Copy size={16} className="mr-2" />
                  <span>Copy Link</span>
                </button>
                <button 
                  onClick={() => handleShare("twitter")}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-dark-100"
                >
                  <Twitter size={16} className="mr-2" />
                  <span>Share on X</span>
                </button>
                <button 
                  onClick={() => handleShare("facebook")}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-dark-100"
                >
                  <Facebook size={16} className="mr-2" />
                  <span>Share on Facebook</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-400">
          <div>{venue}</div>
          <div className="mt-1">
            {date}
            {time && <span> • {time}</span>}
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={() => handleShare("facebook")}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook size={16} />
            </button>
            <button 
              onClick={() => handleShare("twitter")}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Share on X"
            >
              <Twitter size={16} />
            </button>
          </div>
          
          {category === "listing" && (
            <button 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Buy tickets"
            >
              <Ticket size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
