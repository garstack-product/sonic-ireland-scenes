import { EventCardProps } from "@/components/ui/EventCard";

export const extractEventFlags = (events: any[]) => {
  const hiddenIds = events.filter(event => event.is_hidden).map(event => event.id);
  const featuredIds = events.filter(event => event.is_featured).map(event => event.id);
  const festivalIds = events.filter(event => event.is_festival).map(event => event.id);
  
  console.log('Loading events - Featured IDs from DB:', featuredIds);
  console.log('Loading events - Hidden IDs from DB:', hiddenIds);
  console.log('Loading events - Festival IDs from DB:', festivalIds);
  
  return { hiddenIds, featuredIds, festivalIds };
};

export const getSortedEvents = (
  events: EventCardProps[],
  sortBy: string,
  hiddenEvents: string[],
  featuredEvents: string[],
  festivalEvents: string[]
) => {
  return [...events].sort((a, b) => {
    switch (sortBy) {
      case "visibility":
        const aHidden = hiddenEvents.includes(a.id);
        const bHidden = hiddenEvents.includes(b.id);
        if (aHidden !== bHidden) return aHidden ? 1 : -1;
        break;
      case "featured":
        const aFeatured = featuredEvents.includes(a.id);
        const bFeatured = featuredEvents.includes(b.id);
        if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;
        break;
      case "festival":
        const aFestival = festivalEvents.includes(a.id);
        const bFestival = festivalEvents.includes(b.id);
        if (aFestival !== bFestival) return aFestival ? -1 : 1;
        break;
      case "date":
      default:
        const aDate = new Date(a.rawDate || a.date);
        const bDate = new Date(b.rawDate || b.date);
        return aDate.getTime() - bDate.getTime();
    }
    // Default secondary sort by date
    const aDate = new Date(a.rawDate || a.date);
    const bDate = new Date(b.rawDate || b.date);
    return aDate.getTime() - bDate.getTime();
  });
};

export const createToggleFunction = (
  currentItems: string[],
  setItems: React.Dispatch<React.SetStateAction<string[]>>,
  logPrefix: string
) => {
  return (id: string) => {
    console.log(`${logPrefix} for event:`, id);
    setItems(prev => {
      const newItems = prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id];
      console.log(`New ${logPrefix.toLowerCase()} events:`, newItems);
      return newItems;
    });
  };
};
