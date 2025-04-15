
import { supabase } from "@/integrations/supabase/client";

// Check cache age and determine if refresh is needed
export const checkCacheAge = async (): Promise<boolean> => {
  try {
    const { data: cacheInfo } = await supabase
      .from('cache_metadata')
      .select('last_updated')
      .eq('id', 'ticketmaster')
      .single();
      
    if (cacheInfo) {
      const lastUpdated = new Date(cacheInfo.last_updated);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      return lastUpdated < oneDayAgo;
    }
    return true; // No cache record found, needs refresh
  } catch (error) {
    console.warn("Error checking cache age:", error);
    return true;
  }
};

// Background sync function
export const triggerBackgroundSync = async (): Promise<void> => {
  try {
    const syncResponse = await fetch('https://eckohtoprkgolyjdiown.supabase.co/functions/v1/ticketmaster-sync');
    const syncResult = await syncResponse.json();
    console.log("Sync result:", syncResult);
  } catch (syncError) {
    console.warn("Background sync failed, proceeding with existing data:", syncError);
  }
};
