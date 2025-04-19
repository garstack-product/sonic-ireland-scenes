
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchTicketmasterEvents } from "../ticketmasterService";

// Force a sync with Ticketmaster API
export const syncTicketmasterEvents = async (): Promise<{ success: boolean, message: string }> => {
  try {
    console.log("Forcing Ticketmaster sync...");
    const response = await fetch('https://eckohtoprkgolyjdiown.supabase.co/functions/v1/ticketmaster-sync');
    
    if (!response.ok) {
      throw new Error(`Sync failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    // Force a refresh of the page after successful sync to show the new data
    if (result.refreshed) {
      toast.success(`Successfully refreshed ${result.count} events. Reloading data...`);
      
      // Wait 2 seconds before suggesting a page reload
      setTimeout(() => {
        toast.info("Please refresh the page to see the latest festival data");
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
    return { success: false, message: `Sync failed: ${error.message}` };
  }
};
