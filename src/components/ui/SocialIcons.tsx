
import React from 'react';
import { Globe, Facebook, Twitter, Music, Youtube, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialLink {
  name: string;
  url: string | null;
  icon: React.ReactNode;
  color: string;
}

interface SocialIconsProps {
  links: SocialLink[];
}

const SocialIcons: React.FC<SocialIconsProps> = ({ links }) => {
  // Filter out null/undefined URLs
  const validLinks = links.filter(link => link.url);
  
  if (!validLinks || validLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <TooltipProvider>
        {validLinks.map((link, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <a
                href={link.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-400 hover:bg-dark-300 transition-colors"
                style={{ color: link.color }}
              >
                {link.icon}
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-dark-200 text-white border-gray-700">
              <p>{link.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export function getSocialLinksFromData(artistData: any): SocialLink[] {
  if (!artistData || !artistData.links) return [];
  
  const links: SocialLink[] = [];
  
  if (artistData.links.website) {
    links.push({
      name: "Website",
      url: artistData.links.website,
      icon: <Globe size={18} />,
      color: "#4a5568"
    });
  }
  
  if (artistData.links.facebook) {
    links.push({
      name: "Facebook",
      url: artistData.links.facebook,
      icon: <Facebook size={18} />,
      color: "#1877F2"
    });
  }
  
  if (artistData.links.twitter) {
    links.push({
      name: "Twitter",
      url: artistData.links.twitter,
      icon: <Twitter size={18} />,
      color: "#1DA1F2"
    });
  }
  
  if (artistData.links.spotify) {
    links.push({
      name: "Spotify",
      url: artistData.links.spotify,
      icon: <Music size={18} />,
      color: "#1DB954"
    });
  }
  
  if (artistData.links.youtube) {
    links.push({
      name: "YouTube",
      url: artistData.links.youtube,
      icon: <Youtube size={18} />,
      color: "#FF0000"
    });
  }
  
  if (artistData.links.itunes) {
    links.push({
      name: "iTunes",
      url: artistData.links.itunes,
      icon: <Music size={18} />,
      color: "#EA4CC0"
    });
  }
  
  if (artistData.links.musicbrainz) {
    links.push({
      name: "MusicBrainz",
      url: artistData.links.musicbrainz,
      icon: <ExternalLink size={18} />,
      color: "#BA478F"
    });
  }
  
  if (artistData.links.wikipedia) {
    links.push({
      name: "Wikipedia",
      url: artistData.links.wikipedia,
      icon: <ExternalLink size={18} />,
      color: "#000000"
    });
  }
  
  return links;
}

export default SocialIcons;
