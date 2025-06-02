
import { useState } from "react";
import { EventCardProps } from "@/components/ui/EventCard";

export const useEventState = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<string[]>([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allEvents, setAllEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncInfo, setLastSyncInfo] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [hiddenEvents, setHiddenEvents] = useState<string[]>([]);
  const [festivalEvents, setFestivalEvents] = useState<string[]>([]);

  return {
    searchTerm,
    setSearchTerm,
    featuredEvents,
    setFeaturedEvents,
    isSubmitting,
    setIsSubmitting,
    allEvents,
    setAllEvents,
    isLoading,
    setIsLoading,
    lastSyncInfo,
    setLastSyncInfo,
    sortBy,
    setSortBy,
    hiddenEvents,
    setHiddenEvents,
    festivalEvents,
    setFestivalEvents
  };
};
