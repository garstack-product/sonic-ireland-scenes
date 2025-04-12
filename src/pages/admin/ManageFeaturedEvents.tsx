
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search, X } from "lucide-react";
import { toast } from "sonner";

// In a real app, this would come from an API or database
const allEvents = [
  { id: "1", title: "The Killers", artist: "The Killers", type: "concert" },
  { id: "2", title: "Electric Picnic", artist: "Various Artists", type: "festival" },
  { id: "3", title: "Longitude", artist: "Various Artists", type: "festival" },
  { id: "4", title: "Arcade Fire", artist: "Arcade Fire", type: "concert" },
];

const ManageFeaturedEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<string[]>(["1"]); // IDs of featured events
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEvents = allEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFeature = (id: string) => {
    setFeaturedEvents(prev => 
      prev.includes(id) 
        ? prev.filter(eventId => eventId !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would send the data to the server
    setTimeout(() => {
      toast.success("Featured events updated successfully!");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-6">Manage Featured Events</h2>
      
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search events..."
          className="pl-10 bg-dark-200 border-gray-700 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
          {filteredEvents.map(event => (
            <div 
              key={event.id} 
              className="flex justify-between items-center p-3 bg-dark-400 rounded-md"
            >
              <div>
                <h3 className="text-white font-medium">{event.title}</h3>
                <p className="text-gray-400 text-sm">{event.artist} • {event.type}</p>
              </div>
              <Button
                type="button"
                variant={featuredEvents.includes(event.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFeature(event.id)}
              >
                {featuredEvents.includes(event.id) ? (
                  <><Check size={16} className="mr-2" /> Featured</>
                ) : (
                  "Feature"
                )}
              </Button>
            </div>
          ))}
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-4 text-gray-400">
              No events found. Try a different search term.
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageFeaturedEvents;
