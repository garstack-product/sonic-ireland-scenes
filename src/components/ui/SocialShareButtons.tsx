
import React from 'react';
import { Facebook, Twitter, Smartphone, Copy } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialShareButtonsProps {
  title: string;
  url: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ title, url }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };
  
  const handleShare = (platform: string) => {
    const text = `Check out ${title}`;
    
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

  return (
    <div className="flex gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => handleShare("facebook")}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-400 text-[#1877F2] hover:bg-dark-300 transition-colors"
            >
              <Facebook size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-dark-200 text-white border-gray-700">
            <p>Share on Facebook</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => handleShare("twitter")}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-400 text-[#1DA1F2] hover:bg-dark-300 transition-colors"
            >
              <Twitter size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-dark-200 text-white border-gray-700">
            <p>Share on X</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => handleShare("whatsapp")}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-400 text-[#25D366] hover:bg-dark-300 transition-colors"
            >
              <Smartphone size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-dark-200 text-white border-gray-700">
            <p>Share on WhatsApp</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={handleCopyLink}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-400 text-[#9b87f5] hover:bg-dark-300 transition-colors"
            >
              <Copy size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-dark-200 text-white border-gray-700">
            <p>Copy Link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SocialShareButtons;
