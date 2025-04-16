
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCardProps } from "@/components/ui/EventCard";

interface EventListingsStatusProps {
  isLoading: boolean;
  displayedListings: EventCardProps[];
  filteredListings: EventCardProps[];
  onLoadMore: () => void;
}

const EventListingsStatus = ({ 
  isLoading, 
  displayedListings, 
  filteredListings, 
  onLoadMore 
}: EventListingsStatusProps) => {
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          {displayedListings.length < filteredListings.length && (
            <div className="mt-8 flex justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onLoadMore}
                className="flex items-center gap-2"
              >
                View More <ChevronDown size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default EventListingsStatus;
