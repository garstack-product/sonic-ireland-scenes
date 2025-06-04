
import { EventCardProps } from "@/components/ui/EventCard";

export const extractEventFlags = (events: EventCardProps[]) => {
  console.log('=== EXTRACTING EVENT FLAGS FROM DATABASE ===');
  console.log('Total events to process:', events.length);
  
  // Extract events that have each flag set to true
  const hiddenIds = events
    .filter(event => {
      const isHidden = event.is_hidden === true;
      if (isHidden) {
        console.log(`Found hidden event: ${event.id} - ${event.title}`);
      }
      return isHidden;
    })
    .map(event => event.id);
    
  const featuredIds = events
    .filter(event => {
      const isFeatured = event.is_featured === true;
      if (isFeatured) {
        console.log(`Found featured event: ${event.id} - ${event.title}`);
      }
      return isFeatured;
    })
    .map(event => event.id);
    
  const festivalIds = events
    .filter(event => {
      const isFestival = event.is_festival === true;
      if (isFestival) {
        console.log(`Found festival event: ${event.id} - ${event.title}`);
      }
      return isFestival;
    })
    .map(event => event.id);
  
  console.log('=== EXTRACTION RESULTS ===');
  console.log('Hidden IDs:', hiddenIds);
  console.log('Featured IDs:', featuredIds);
  console.log('Festival IDs:', festivalIds);
  
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
    console.log(`=== ${logPrefix.toUpperCase()} ===`);
    console.log(`Event ID: ${id}`);
    console.log(`Current items before toggle:`, currentItems);
    
    setItems(prev => {
      const isCurrentlySelected = prev.includes(id);
      const newItems = isCurrentlySelected 
        ? prev.filter(eventId => eventId !== id) 
        : [...prev, id];
      
      console.log(`Was selected: ${isCurrentlySelected}`);
      console.log(`New items after toggle:`, newItems);
      
      return newItems;
    });
  };
};
