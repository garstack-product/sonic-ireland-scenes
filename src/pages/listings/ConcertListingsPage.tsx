
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCardProps } from "@/components/ui/EventCard";
import { API_KEYS } from "@/config/api-keys";
import { toast } from "sonner";

// Format time from Ticketmaster API to readable format (e.g., "6:30pm")
const formatTime = (time: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? 'pm' : 'am';
  const hour12 = hourNum % 12 || 12; // Convert 0 to 12 for 12am
  return `${hour12}:${minute}${period}`;
};

// Format date from Ticketmaster API to readable format (e.g., "January 1, 2025")
const formatDate = (date: string) => {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const ConcertListingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [isLoading, setIsLoading] = useState(true);
  const [concertListings, setConcertListings] = useState<EventCardProps[]>([]);
  const [genres, setGenres] = useState<string[]>(["All Genres"]);
  
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        setIsLoading(true);
        
        // Get events for Ireland (countryCode=IE)
        const response = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=IE&classificationName=music&size=50&apikey=${API_KEYS.TICKETMASTER}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from Ticketmaster');
        }
        
        const data = await response.json();
        
        // Handle case where no events are found
        if (!data._embedded?.events) {
          setConcertListings([]);
          setIsLoading(false);
          return;
        }
        
        // Extract all genres
        const allGenres = new Set<string>();
        allGenres.add("All Genres");
        
        // Map Ticketmaster events to our event format
        const events = data._embedded.events.map((event: any) => {
          // Extract genre and subgenre information
          const genre = event.classifications?.[0]?.genre?.name || "";
          const subgenre = event.classifications?.[0]?.subGenre?.name || "";
          
          if (genre && genre !== "Undefined") {
            allGenres.add(genre);
          }
          
          // Get venue info
          const venue = event._embedded?.venues?.[0]?.name || "";
          const city = event._embedded?.venues?.[0]?.city?.name || "";
          const venueFull = city ? `${venue}, ${city}` : venue;
          
          // Get price info
          const minPrice = event.priceRanges?.[0]?.min || 0;
          const maxPrice = event.priceRanges?.[0]?.max || 0;
          const priceDisplay = minPrice === maxPrice 
            ? `€${minPrice.toFixed(2)}` 
            : `€${minPrice.toFixed(2)} - €${maxPrice.toFixed(2)}`;
            
          // Get image
          const imageUrl = event.images?.find((img: any) => img.ratio === "16_9" && img.width > 500)?.url 
            || event.images?.[0]?.url 
            || "/placeholder.svg";
            
          // Get date and time
          const startDate = event.dates?.start?.localDate || "";
          const startTime = event.dates?.start?.localTime || "";
          const formattedDate = formatDate(startDate);
          const formattedTime = formatTime(startTime);
          
          return {
            id: event.id,
            title: event.name,
            artist: event.name.includes(":") ? event.name.split(":")[0] : event._embedded?.attractions?.[0]?.name || "",
            venue: venueFull,
            date: formattedDate,
            time: formattedTime,
            imageUrl: imageUrl,
            type: "concert" as const,
            category: "listing" as const,
            genre: genre !== "Undefined" ? genre : undefined,
            subgenre: subgenre !== "Undefined" ? subgenre : undefined,
            price: minPrice
          };
        });
        
        setConcertListings(events);
        setGenres(Array.from(allGenres));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Ticketmaster data:", error);
        toast.error("Failed to load concert data. Please try again later.");
        setIsLoading(false);
      }
    };
    
    fetchConcerts();
  }, []);
  
  const filteredListings = concertListings.filter(listing => {
    const matchesSearch = 
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.venue?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre === "All Genres" || listing.genre === selectedGenre;
    
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    
    return matchesSearch && matchesGenre && matchesPrice;
  });

  return (
    <div>
      <PageHeader 
        title="Concert Listings" 
        subtitle="Discover upcoming concerts in Ireland from Ticketmaster and Eventbrite"
      />
      
      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by artist or venue..."
            className="pl-10 bg-dark-300 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="bg-dark-300 border-gray-700 text-white">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-gray-700 text-white">
            {genres.map(genre => (
              <SelectItem key={genre} value={genre} className="hover:bg-dark-100">
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Price Range: €{priceRange[0]} - €{priceRange[1]}</span>
          </div>
          <Slider
            defaultValue={[0, 500]}
            min={0}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="py-2"
          />
        </div>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-400">
          {isLoading ? "Loading events..." : `${filteredListings.length} events found`}
        </p>
        <Button variant="outline" className="flex items-center space-x-2">
          <Calendar size={16} />
          <span>Date Range</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <EventGrid 
          events={filteredListings} 
          emptyMessage="No concerts found matching your filters. Try adjusting your search."
        />
      )}
    </div>
  );
};

export default ConcertListingsPage;
