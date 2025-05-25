
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

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
}

const EventCard = ({ id, title, artist, venue, date, imageUrl, type, category }: EventCardProps) => {
  // Generate the correct route based on type and category
  const getRoute = () => {
    if (category === 'review') {
      return `/reviews/${type}s/${id}`;
    }
    return `/listings/${type}s/${id}`;
  };

  return (
    <Link to={getRoute()} className="h-full">
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-dark-300 border-gray-700 hover:border-gray-600 h-full flex flex-col">
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={imageUrl} 
            alt={`${artist} at ${venue}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-300 text-sm mb-1 line-clamp-1">{artist}</p>
          <p className="text-gray-400 text-sm mb-2 line-clamp-1">{venue}</p>
          <p className="text-gray-500 text-xs mt-auto">{date}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;
