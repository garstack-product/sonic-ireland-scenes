
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

        setFestivals(events || []);
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
