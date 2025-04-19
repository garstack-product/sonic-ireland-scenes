
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Force a sync with Ticketmaster API
export const syncTicketmasterEvents = async (): Promise<{ success: boolean, message: string }> => {
  try {
    console.log("Forcing Ticketmaster sync...");
    
    // Make a direct call to the Supabase Edge Function
    const response = await fetch('https://eckohtoprkgolyjdiown.supabase.co/functions/v1/ticketmaster-sync', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Sync failed with status: ${response.status}`, errorText);
      throw new Error(`Sync failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    // Show success message with refresh recommendation
    if (result.refreshed) {
      toast.success(`Successfully refreshed ${result.count} events. Reloading data...`);
      
      // Wait 2 seconds before suggesting a page reload
      setTimeout(() => {
        toast.info("Please refresh the page to see the latest festival data", {
          duration: 5000,
          action: {
            label: "Refresh Now",
            onClick: () => window.location.reload()
          }
        });
      }, 2000);
    }
    
    return { 
      success: true, 
      message: result.refreshed 
        ? `Successfully refreshed ${result.count} events` 
        : `Using cached data (${result.count} events)` 
    };
  } catch (error) {
    console.error("Error syncing with Ticketmaster:", error);
    return { 
      success: false, 
      message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};
