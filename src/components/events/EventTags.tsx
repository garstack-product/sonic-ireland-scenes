
import { Link } from "react-router-dom";

interface EventTagsProps {
  genre?: string;
  subgenre?: string;
  type: "concert" | "festival";
}

const EventTags = ({ genre, subgenre, type }: EventTagsProps) => {
  if (!genre && !subgenre) return null;

  // Construct proper paths for filtering
  const genrePath = genre 
    ? `/listings/${type}s?genre=${encodeURIComponent(genre)}`
    : "";
    
  const subgenrePath = subgenre 
    ? `/listings/${type}s?subgenre=${encodeURIComponent(subgenre)}`
    : "";

  return (
    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
      {genre && (
        <Link 
          to={genrePath}
          className="px-2 py-1 text-xs font-medium bg-dark-500/80 text-white rounded backdrop-blur-sm hover:bg-dark-400"
          onClick={(e) => e.stopPropagation()}
        >
          {genre}
        </Link>
      )}
      {subgenre && (
        <Link 
          to={subgenrePath}
          className="px-2 py-1 text-xs font-medium bg-dark-500/80 text-white rounded backdrop-blur-sm hover:bg-dark-400"
          onClick={(e) => e.stopPropagation()}
        >
          {subgenre}
        </Link>
      )}
    </div>
  );
};

export default EventTags;
