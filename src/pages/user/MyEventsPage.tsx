
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { useAuth } from "@/contexts/AuthContext";
import { EventCardProps } from "@/components/ui/EventCard";
import { API_KEYS } from "@/config/api-keys";
import { toast } from "sonner";

const MyEventsPage = () => {
  const { user, isLoading } = useAuth();
  const [likedEvents, setLikedEvents] = useState<EventCardProps[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      try {
        setIsLoadingEvents(true);
        
        // In a real app, this would fetch the liked events from the API
        // For demo, let's fetch some events from Ticketmaster and filter by IDs
        const response = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=IE&classificationName=music&size=100&apikey=${API_KEYS.TICKETMASTER}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from Ticketmaster');
        }
        
        const data = await response.json();
        
        // Handle case where no events are found
        if (!data._embedded?.events) {
          setLikedEvents([]);
          setIsLoadingEvents(false);
          return;
        }
        
        // Since we're using mock data, we'll just take the first few events
        // In a real app, we would filter by the actual event IDs in user.likedEvents
        const events = data._embedded.events.slice(0, user.likedEvents.length).map((event: any, index: number) => {
          // Get venue info
          const venue = event._embedded?.venues?.[0]?.name || "";
          const city = event._embedded?.venues?.[0]?.city?.name || "";
          const venueFull = city ? `${venue}, ${city}` : venue;
          
          // Get image
          const imageUrl = event.images?.find((img: any) => img.ratio === "16_9" && img.width > 500)?.url 
            || event.images?.[0]?.url 
            || "/placeholder.svg";
            
          // Get genre and subgenre information
          const genre = event.classifications?.[0]?.genre?.name || "";
          const subgenre = event.classifications?.[0]?.subGenre?.name || "";
          
          return {
            id: user.likedEvents[index], // Use the ID from user.likedEvents
            title: event.name,
            artist: event.name.includes(":") ? event.name.split(":")[0] : event._embedded?.attractions?.[0]?.name || "",
            venue: venueFull,
            date: new Date(event.dates?.start?.localDate || "").toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            time: event.dates?.start?.localTime 
              ? new Date(`2000-01-01T${event.dates.start.localTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
              : undefined,
            imageUrl: imageUrl,
            type: "concert" as const,
            category: "listing" as const,
            genre: genre !== "Undefined" ? genre : undefined,
            subgenre: subgenre !== "Undefined" ? subgenre : undefined
          };
        });
        
        setLikedEvents(events);
        setIsLoadingEvents(false);
      } catch (error) {
        console.error("Error fetching liked events:", error);
        toast.error("Failed to load your liked events. Please try again later.");
        setIsLoadingEvents(false);
      }
    };
    
    fetchEvents();
  }, [user]);

  // Redirect if not logged in
  if (!isLoading && !user) {
    return <Navigate to="/login" state={{ from: { pathname: "/listings/my-events" } }} />;
  }

  return (
    <div>
      <PageHeader 
        title="My Liked Events" 
        subtitle="Events you've liked and saved for later"
      />
      
      {isLoading || isLoadingEvents ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="mt-8">
          <EventGrid 
            events={likedEvents} 
            emptyMessage="You haven't liked any events yet. Browse concerts and festivals to find events you're interested in."
          />
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
