
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { syncTicketmasterEvents } from "@/services/api/events/syncService";

interface EventSyncButtonProps {
  isLoading: boolean;
  onSyncComplete: () => Promise<void>;
  lastSyncInfo: string;
}

const EventSyncButton = ({ isLoading, onSyncComplete, lastSyncInfo }: EventSyncButtonProps) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncEvents = async () => {
    try {
      setIsSyncing(true);
      toast.info("Syncing Ticketmaster events...");
      
      const result = await syncTicketmasterEvents();
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      toast.success(result.message);
      await onSyncComplete();
      
      // After successful sync, prompt the user to refresh the page to see all new events
      toast.info("Please refresh the page to see all new festival data", {
        duration: 5000,
        action: {
          label: "Refresh Now",
          onClick: () => window.location.reload()
        }
      });
    } catch (error) {
      console.error("Error syncing events:", error);
      toast.error(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        variant="default" 
        size="sm" 
        className="w-full"
        onClick={handleSyncEvents}
        disabled={isLoading || isSyncing}
      >
        {isSyncing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Ticketmaster
          </>
        )}
      </Button>
      <p className="text-xs text-gray-400">{lastSyncInfo}</p>
    </div>
  );
};

export default EventSyncButton;
