
import React from "react";

interface SocialLink {
  name: string;
  url: string | null;
  icon: React.ReactNode;
  color: string;
}

interface EventSocialIconsRowProps {
  links: SocialLink[];
}

const EventSocialIconsRow: React.FC<EventSocialIconsRowProps> = ({ links }) => {
  if (!links.length) return null;
  return (
    <div className="flex justify-center gap-4 py-4 bg-dark-400">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url!}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 bg-dark-300 hover:bg-dark-200 transition-colors"
          style={{ color: link.color }}
          title={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default EventSocialIconsRow;
