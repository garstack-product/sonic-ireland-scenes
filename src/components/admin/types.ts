
import { EventCardProps } from "@/components/ui/EventCard";

export interface AdminEventState {
  searchTerm: string;
  featuredEvents: string[];
  isSubmitting: boolean;
  allEvents: EventCardProps[];
  isLoading: boolean;
  lastSyncInfo: string;
  sortBy: string;
  hiddenEvents: string[];
  festivalEvents: string[];
}

export interface AdminEventActions {
  setSearchTerm: (term: string) => void;
  setSortBy: (sortBy: string) => void;
  loadEvents: () => Promise<void>;
  getLastSyncInfo: () => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  toggleEventVisibility: (id: string) => void;
  toggleFeature: (id: string) => void;
  toggleFestival: (id: string) => void;
  getSortedEvents: (events: EventCardProps[]) => EventCardProps[];
}
