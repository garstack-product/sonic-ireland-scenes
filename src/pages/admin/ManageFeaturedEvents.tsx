import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search, X } from "lucide-react";
import { toast } from "sonner";
import { fetchTicketmasterEvents } from "@/services/api";
import { EventCardProps } from "@/components/ui/EventCard";

const ManageFeaturedEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<string[]>([]); // IDs of featured events
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allEvents, setAllEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        // Load events from Ticketmaster
        const events = await fetchTicketmasterEvents();
        
        setAllEvents(events);
        
        // Try to load saved featured events from localStorage
        const savedFeaturedEvents = localStorage.getItem('featuredEvents');
        if (savedFeaturedEvents) {
          setFeaturedEvents(JSON.parse(savedFeaturedEvents));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading events:', error);
        toast.error('Failed to load events');
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, []);

  const filteredEvents = allEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    try {
      // Save to localStorage
      localStorage.setItem('featuredEvents', JSON.stringify(featuredEvents));
      
      toast.success("Featured events updated successfully!");
    } catch (error) {
      console.error('Error saving featured events:', error);
      toast.error('Failed to save featured events');
    } finally {
      setIsSubmitting(false);
    }
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
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="flex justify-between items-center p-3 bg-dark-400 rounded-md"
                >
                  <div>
                    <h3 className="text-white font-medium">{event.title}</h3>
                    <p className="text-gray-400 text-sm">{event.artist} • {event.venue}</p>
                    <p className="text-gray-400 text-sm">{event.date}</p>
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
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No events found. Try a different search term.
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <p className="text-gray-400">
            {featuredEvents.length} events selected as featured
          </p>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageFeaturedEvents;
