
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCardProps } from "@/components/ui/EventCard";
import { toast } from "sonner";
import { fetchTicketmasterEvents } from "@/services/api";

const ConcertListingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [isLoading, setIsLoading] = useState(true);
  const [concertListings, setConcertListings] = useState<EventCardProps[]>([]);
  const [genres, setGenres] = useState<string[]>(["All Genres"]);
  
  useEffect(() => {
    const loadConcerts = async () => {
      try {
        setIsLoading(true);
        const events = await fetchTicketmasterEvents();
        
        // Extract all genres
        const allGenres = new Set<string>();
        allGenres.add("All Genres");
        
        events.forEach(event => {
          if (event.genre && event.genre !== "Undefined") {
            allGenres.add(event.genre);
          }
        });
        
        setConcertListings(events);
        setGenres(Array.from(allGenres));
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading concert data:", error);
        toast.error("Failed to load concert data. Please try again later.");
        setIsLoading(false);
      }
    };
    
    loadConcerts();
  }, []);
  
  const filteredListings = concertListings.filter(listing => {
    const matchesSearch = 
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.venue?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre === "All Genres" || listing.genre === selectedGenre;
    
    const matchesPrice = 
      !listing.price || 
      (listing.price >= priceRange[0] && listing.price <= priceRange[1]);
    
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
