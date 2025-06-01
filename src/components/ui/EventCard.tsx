

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import ShareMenu from "@/components/events/ShareMenu";

export interface EventCardProps {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  imageUrl: string;
  type: 'concert' | 'festival';
  category: 'review' | 'listing';
  time?: string;
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
  start_price?: number;
  max_price?: number;
  country?: string;
}

const EventCard = ({ id, title, artist, venue, date, imageUrl, type, category }: EventCardProps) => {
  // Generate the correct route based on type and category
  const getRoute = () => {
    if (category === 'review') {
      return `/reviews/${type}s/${id}`;
    }
    return `/listings/${type}s/${id}`;
  };

  const detailPath = getRoute();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-dark-300 border-gray-700 hover:border-gray-600 h-full flex flex-col relative">
      <Link to={detailPath} className="h-full block">
        <div className="aspect-video overflow-hidden rounded-t-lg flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={`${artist} at ${venue}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2 min-h-[3rem]">
              {title}
            </h3>
            <p className="text-gray-300 text-sm mb-1 line-clamp-1">{artist}</p>
            <p className="text-gray-400 text-sm mb-2 line-clamp-1">{venue}</p>
          </div>
          <div className="flex justify-between items-end mt-auto">
            <p className="text-gray-500 text-xs">{date}</p>
          </div>
        </CardContent>
      </Link>
      
      {/* Social Share Icons - positioned in lower right */}
      <div className="absolute bottom-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
        <ShareMenu 
          title={title}
          artist={artist}
          type={type}
          detailPath={detailPath}
        />
      </div>
    </Card>
  );
};

export default EventCard;

