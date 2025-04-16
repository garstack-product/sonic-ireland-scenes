
import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import EventGrid from "@/components/ui/EventGrid";
import { EventCardProps } from "@/components/ui/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UKFestivalsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [festivals, setFestivals] = useState<EventCardProps[]>([]);

  useEffect(() => {
    const loadFestivals = async () => {
      try {
        setIsLoading(true);
        
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .eq('country', 'UK')
          .eq('is_festival', true)
          .order('raw_date', { ascending: true });

        if (error) throw error;

        // Map the database fields to the EventCardProps format
        const mappedEvents: EventCardProps[] = (events || []).map(event => ({
          id: event.id,
          title: event.title,
          artist: event.artist || '',
          venue: event.venue || '',
          date: event.date || '',
          time: event.time || '',
          imageUrl: event.image_url || '/placeholder.svg', // Map image_url to imageUrl
          type: (event.type as 'concert' | 'festival') || 'festival',
          category: 'listing' as const, // Add the required category field
          genre: event.genre || undefined,
          subgenre: event.subgenre || undefined,
          price: event.price || undefined,
          ticketUrl: event.ticket_url || undefined,
          rawDate: event.raw_date || undefined,
          onSaleDate: event.on_sale_date || null,
          source: 'database',
          venue_id: event.venue_id || undefined,
          is_featured: event.is_featured,
          is_hidden: event.is_hidden,
          rawData: event.raw_data
        }));

        setFestivals(mappedEvents);
      } catch (error) {
        console.error("Error loading UK festivals:", error);
        toast.error("Failed to load UK festivals");
      } finally {
        setIsLoading(false);
      }
    };

    loadFestivals();
  }, []);

  return (
    <div>
      <PageHeader 
        title="UK Festivals" 
        subtitle="Discover upcoming festivals in the United Kingdom"
      />
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <EventGrid 
          events={festivals} 
          emptyMessage="No UK festivals found at this time."
        />
      )}
    </div>
  );
};

export default UKFestivalsPage;
