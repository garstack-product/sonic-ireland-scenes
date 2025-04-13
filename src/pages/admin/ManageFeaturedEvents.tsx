
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { fetchAllEvents } from "@/services/api";
import { EventCardProps } from "@/components/ui/EventCard";
import { supabase } from "@/integrations/supabase/client";

const ManageFeaturedEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<string[]>([]); // IDs of featured events
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allEvents, setAllEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        // Load events from database
        const events = await fetchAllEvents();
        
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

  // Manual sync function
  const handleSyncEvents = async () => {
    try {
      setIsSyncing(true);
      toast.info("Syncing Ticketmaster events...");
      
      const response = await fetch('https://eckohtoprkgolyjdiown.supabase.co/functions/v1/ticketmaster-sync');
      if (!response.ok) {
        throw new Error(`Sync failed with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast.success(`Sync complete: ${result.refreshed ? 'Data refreshed' : 'Using cached data'} (${result.count} events)`);
      
      // Reload events
      setIsLoading(true);
      const events = await fetchAllEvents();
      setAllEvents(events);
      setIsLoading(false);
    } catch (error) {
      console.error("Error syncing events:", error);
      toast.error(`Sync failed: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Manage Featured Events</h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSyncEvents}
          disabled={isLoading || isSyncing}
        >
          {isSyncing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            "Sync Ticketmaster"
          )}
        </Button>
      </div>
      
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
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageFeaturedEvents;
