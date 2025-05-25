
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  imageUrl: string;
  type: 'concert' | 'festival';
  category: 'review' | 'listing';
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
    <Link to={getRoute()}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-dark-300 border-gray-700 hover:border-gray-600">
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={imageUrl} 
            alt={`${artist} at ${venue}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-300 text-sm mb-1">{artist}</p>
          <p className="text-gray-400 text-sm mb-2">{venue}</p>
          <p className="text-gray-500 text-xs">{date}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;
