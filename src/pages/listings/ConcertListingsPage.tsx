
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - this would come from the Ticketmaster/Eventbrite APIs
const concertListings = [
  {
    id: "101",
    title: "Soul & Jazz Night",
    artist: "Norah Jones",
    venue: "Olympia Theatre, Dublin",
    date: "June 12, 2025",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const,
    genre: "Jazz",
    price: 65
  },
  {
    id: "102",
    title: "Rock Revival",
    artist: "Foo Fighters",
    venue: "3Arena, Dublin",
    date: "July 22, 2025",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const,
    genre: "Rock",
    price: 85
  },
  {
    id: "103",
    title: "Electronic Beats",
    artist: "Daft Punk Tribute",
    venue: "The Academy, Dublin",
    date: "May 18, 2025",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const,
    genre: "Electronic",
    price: 40
  },
  {
    id: "104",
    title: "Irish Folk Night",
    artist: "The Chieftains",
    venue: "National Concert Hall, Dublin",
    date: "August 3, 2025",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const,
    genre: "Folk",
    price: 55
  },
  {
    id: "105",
    title: "Hip Hop Showcase",
    artist: "Kendrick Lamar",
    venue: "Malahide Castle, Dublin",
    date: "June 30, 2025",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const,
    genre: "Hip Hop",
    price: 90
  },
  {
    id: "106",
    title: "Classical Evening",
    artist: "Dublin Philharmonic Orchestra",
    venue: "National Concert Hall, Dublin",
    date: "May 26, 2025",
    imageUrl: "/placeholder.svg",
    type: "concert" as const,
    category: "listing" as const,
    genre: "Classical",
    price: 60
  }
];

const genres = ["All Genres", "Rock", "Pop", "Electronic", "Hip Hop", "Jazz", "Classical", "Folk"];

const ConcertListingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [priceRange, setPriceRange] = useState([0, 100]);
  
  const filteredListings = concertListings.filter(listing => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
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
            defaultValue={[0, 100]}
            min={0}
            max={100}
            step={5}
            value={priceRange}
            onValueChange={setPriceRange}
            className="py-2"
          />
        </div>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-400">{filteredListings.length} events found</p>
        <Button variant="outline" className="flex items-center space-x-2">
          <Calendar size={16} />
          <span>Date Range</span>
        </Button>
      </div>
      
      <EventGrid 
        events={filteredListings} 
        emptyMessage="No concerts found matching your filters. Try adjusting your search."
      />
    </div>
  );
};

export default ConcertListingsPage;
