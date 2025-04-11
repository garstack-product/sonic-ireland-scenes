
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - this would come from the Ticketmaster/Eventbrite APIs
const festivalListings = [
  {
    id: "201",
    title: "Electric Picnic 2025",
    artist: "Multiple Artists",
    venue: "Stradbally Hall, Co. Laois",
    date: "September 5-7, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival" as const,
    category: "listing" as const,
    genre: "Mixed",
    price: 250
  },
  {
    id: "202",
    title: "Longitude 2025",
    artist: "Multiple Artists",
    venue: "Marlay Park, Dublin",
    date: "July 4-6, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival" as const,
    category: "listing" as const,
    genre: "Hip Hop",
    price: 190
  },
  {
    id: "203",
    title: "All Together Now 2025",
    artist: "Multiple Artists",
    venue: "Curraghmore Estate, Co. Waterford",
    date: "August 1-3, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival" as const,
    category: "listing" as const,
    genre: "Mixed",
    price: 220
  },
  {
    id: "204",
    title: "Body & Soul 2025",
    artist: "Multiple Artists",
    venue: "Ballinlough Castle, Co. Westmeath",
    date: "June 20-22, 2025",
    imageUrl: "/placeholder.svg",
    type: "festival" as const,
    category: "listing" as const,
    genre: "Electronic",
    price: 180
  }
];

const genres = ["All Genres", "Rock", "Pop", "Electronic", "Hip Hop", "Mixed"];

const FestivalListingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [priceRange, setPriceRange] = useState([0, 300]);
  
  const filteredListings = festivalListings.filter(listing => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre === "All Genres" || listing.genre === selectedGenre;
    
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    
    return matchesSearch && matchesGenre && matchesPrice;
  });

  return (
    <div>
      <PageHeader 
        title="Festival Listings" 
        subtitle="Discover upcoming festivals in Ireland from Ticketmaster and Eventbrite"
      />
      
      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by name or location..."
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
            defaultValue={[0, 300]}
            min={0}
            max={300}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="py-2"
          />
        </div>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-400">{filteredListings.length} festivals found</p>
        <Button variant="outline" className="flex items-center space-x-2">
          <Calendar size={16} />
          <span>Date Range</span>
        </Button>
      </div>
      
      <EventGrid 
        events={filteredListings} 
        emptyMessage="No festivals found matching your filters. Try adjusting your search."
      />
    </div>
  );
};

export default FestivalListingsPage;
