
import EventSyncButton from "@/components/admin/EventSyncButton";

interface FeaturedEventsHeaderProps {
  isLoading: boolean;
  onSyncComplete: () => Promise<void>;
  lastSyncInfo: string;
}

const FeaturedEventsHeader = ({
  isLoading,
  onSyncComplete,
  lastSyncInfo
}: FeaturedEventsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-white">Manage Featured Events</h2>
      <EventSyncButton
        isLoading={isLoading}
        onSyncComplete={onSyncComplete}
        lastSyncInfo={lastSyncInfo}
      />
    </div>
  );
};

export default FeaturedEventsHeader;
