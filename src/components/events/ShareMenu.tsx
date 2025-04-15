
import { Copy, Facebook, Twitter, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface ShareMenuProps {
  title: string;
  artist: string;
  type: "concert" | "festival";
  detailPath: string;
  onShare?: () => void;
}

const ShareMenu = ({ title, artist, type, detailPath, onShare }: ShareMenuProps) => {
  const handleCopyLink = () => {
    const url = `${window.location.origin}${detailPath}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
    onShare?.();
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
    onShare?.();
  };

  return (
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
  );
};

export default ShareMenu;
