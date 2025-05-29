
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { fetchAllEvents } from "@/services/api";
import { EventCardProps } from "@/components/ui/EventCard";
import { supabase } from "@/integrations/supabase/client";
import EventSyncButton from "@/components/admin/EventSyncButton";
import EventsList from "@/components/admin/EventsList";

const ManageFeaturedEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<string[]>([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allEvents, setAllEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncInfo, setLastSyncInfo] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");

  const [hiddenEvents, setHiddenEvents] = useState<string[]>([]);
  const [festivalEvents, setFestivalEvents] = useState<string[]>([]); 

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      
      const events = await fetchAllEvents();
      setAllEvents(events);
      
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('id, is_hidden, is_featured, is_festival');
      
      if (error) {
        throw error;
      }
        
      if (eventsData) {
        setHiddenEvents(eventsData.filter(event => event.is_hidden).map(event => event.id));
        setFeaturedEvents(eventsData.filter(event => event.is_featured).map(event => event.id));
        setFestivalEvents(eventsData.filter(event => event.is_festival).map(event => event.id));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const getLastSyncInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('cache_metadata')
        .select('last_updated, record_count')
        .eq('id', 'ticketmaster')
        .single();
      
      if (error) {
        console.error("Error fetching last sync info:", error);
        setLastSyncInfo("No sync information available");
        return;
      }
      
      if (data) {
        const lastSyncDate = new Date(data.last_updated);
        const formattedDate = lastSyncDate.toLocaleString();
        setLastSyncInfo(`Last synced: ${formattedDate} (${data.record_count} events)`);
      } else {
        setLastSyncInfo("No sync information available");
      }
    } catch (error) {
      console.error("Error fetching sync info:", error);
      setLastSyncInfo("Error fetching sync info");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Update events in Supabase
      for (const eventId of allEvents.map(event => event.id)) {
        const { error } = await supabase
          .from('events')
          .update({ 
            is_featured: featuredEvents.includes(eventId),
            is_hidden: hiddenEvents.includes(eventId),
            is_festival: festivalEvents.includes(eventId)
          })
          .eq('id', eventId);
          
        if (error) throw error;
      }
      
      toast.success("Events updated successfully!");
      // Reload events to reflect changes
      await loadEvents();
    } catch (error) {
      console.error('Error saving event settings:', error);
      toast.error('Failed to save event settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEventVisibility = (id: string) => {
    setHiddenEvents(prev => 
      prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id]
    );
  };

  const toggleFeature = (id: string) => {
    setFeaturedEvents(prev => 
      prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id]
    );
  };

  const toggleFestival = (id: string) => {
    setFestivalEvents(prev => 
      prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id]
    );
  };

  const getSortedEvents = (events: EventCardProps[]) => {
    return [...events].sort((a, b) => {
      switch (sortBy) {
        case "visibility":
          const aHidden = hiddenEvents.includes(a.id);
          const bHidden = hiddenEvents.includes(b.id);
          if (aHidden !== bHidden) return aHidden ? 1 : -1;
          break;
        case "featured":
          const aFeatured = featuredEvents.includes(a.id);
          const bFeatured = featuredEvents.includes(b.id);
          if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;
          break;
        case "festival":
          const aFestival = festivalEvents.includes(a.id);
          const bFestival = festivalEvents.includes(b.id);
          if (aFestival !== bFestival) return aFestival ? -1 : 1;
          break;
        case "date":
        default:
          const aDate = new Date(a.rawDate || a.date);
          const bDate = new Date(b.rawDate || b.date);
          return aDate.getTime() - bDate.getTime();
      }
      // Default secondary sort by date
      const aDate = new Date(a.rawDate || a.date);
      const bDate = new Date(b.rawDate || b.date);
      return aDate.getTime() - bDate.getTime();
    });
  };

  const filteredEvents = allEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEvents = getSortedEvents(filteredEvents);

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Manage Featured Events</h2>
        <EventSyncButton
          isLoading={isLoading}
          onSyncComplete={async () => {
            await loadEvents();
            await getLastSyncInfo();
          }}
          lastSyncInfo={lastSyncInfo}
        />
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="relative">
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
        
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-400" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-dark-200 border-gray-700 text-white">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-dark-200 border-gray-700">
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="featured">Featured First</SelectItem>
              <SelectItem value="festival">Festivals First</SelectItem>
              <SelectItem value="visibility">Visible First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <EventsList
            events={sortedEvents}
            hiddenEvents={hiddenEvents}
            festivalEvents={festivalEvents}
            featuredEvents={featuredEvents}
            onToggleVisibility={toggleEventVisibility}
            onToggleFestival={toggleFestival}
            onToggleFeature={toggleFeature}
          />
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            <p>{featuredEvents.length} events featured</p>
            <p>{festivalEvents.length} events marked as festivals</p>
            <p>{hiddenEvents.length} events hidden</p>
          </div>
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
