import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [subgenre, setSubgenre] = useState("");
  const [price, setPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [eventType, setEventType] = useState<"concert" | "festival">("concert");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ultra-robust genre options with comprehensive validation
  const genreOptions = [
    "Rock", "Pop", "Electronic", "Hip-Hop", "R&B", "Jazz", "Blues", 
    "Classical", "Country", "Folk", "Metal", "Indie", "Alternative"
  ].filter(option => {
    const isValid = option && 
                   typeof option === 'string' && 
                   option.trim().length > 0 &&
                   option.trim() !== "" &&
                   option !== null &&
                   option !== undefined;
    
    if (!isValid) {
      console.log(`AddEvent: Filtering out invalid genre option:`, option);
    }
    return isValid;
  });

  console.log("AddEvent: Valid genre options:", genreOptions);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format date for raw_date - handle both concert and festival dates
      let rawDate = null;
      let displayDate = "";
      
      if (eventType === 'concert' && date) {
        rawDate = new Date(`${date}T${time || "00:00:00"}`);
        displayDate = formatDateForDisplay(date);
      } else if (eventType === 'festival' && startDate) {
        rawDate = new Date(`${startDate}T${time || "00:00:00"}`);
        if (endDate && endDate !== startDate) {
          displayDate = `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
        } else {
          displayDate = formatDateForDisplay(startDate);
        }
      }
      
      // Create event object
      const eventData = {
        id: `manual-${Date.now()}`,
        title,
        artist,
        venue,
        date: displayDate,
        time: time || undefined,
        image_url: imageUrl || '/placeholder.svg',
        type: eventType,
        genre: genre || undefined,
        subgenre: subgenre || undefined,
        price: price ? parseFloat(price) : null,
        ticket_url: ticketUrl || undefined,
        raw_date: rawDate ? rawDate.toISOString() : null,
        is_featured: isFeatured,
        is_festival: eventType === 'festival',
        description,
        // For price ranges in raw_data
        raw_data: price ? {
          priceRanges: [{
            min: parseFloat(price),
            max: maxPrice ? parseFloat(maxPrice) : parseFloat(price)
          }]
        } : null
      };

      console.log("Submitting event data:", eventData);

      // Use custom RPC function to insert event
      const { error } = await supabase.rpc('admin_add_event', { 
        event_data: eventData 
      });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      toast.success("Event added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IE', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const resetForm = () => {
    setTitle("");
    setArtist("");
    setVenue("");
    setDate("");
    setStartDate("");
    setEndDate("");
    setTime("");
    setDescription("");
    setGenre("");
    setSubgenre("");
    setPrice("");
    setMaxPrice("");
    setTicketUrl("");
    setImageUrl("");
    setEventType("concert");
    setIsFeatured(false);
  };

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-6">Add New Event</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Event Title*
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-dark-200 border-gray-700 text-white"
              placeholder="Enter event title"
            />
          </div>
          
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-300 mb-1">
              Artist/Performer
            </label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="bg-dark-200 border-gray-700 text-white"
              placeholder="Enter artist or performer name"
            />
          </div>
          
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-1">
              Venue*
            </label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              className="bg-dark-200 border-gray-700 text-white"
              placeholder="Enter venue name"
            />
          </div>
          
          {eventType === 'concert' ? (
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                Date*
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-dark-200 border-gray-700 text-white"
              />
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date*
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="bg-dark-200 border-gray-700 text-white"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                  End Date*
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="bg-dark-200 border-gray-700 text-white"
                />
              </div>
            </>
          )}
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
              Time
            </label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-dark-200 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-300 mb-1">
              Event Type*
            </label>
            <Select value={eventType} onValueChange={(value) => setEventType(value as "concert" | "festival")}>
              <SelectTrigger className="bg-dark-200 border-gray-700 text-white">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-dark-200 border-gray-700 text-white">
                <SelectItem value="concert">Concert</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-1">
              Genre
            </label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="bg-dark-200 border-gray-700 text-white">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent className="bg-dark-200 border-gray-700 text-white">
                {genreOptions.length > 0 ? (
                  genreOptions.map((option) => {
                    console.log(`AddEvent: Rendering SelectItem for genre: "${option}"`);
                    return (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    );
                  })
                ) : (
                  <SelectItem key="no-genres" value="No Genres Available">No Genres Available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="subgenre" className="block text-sm font-medium text-gray-300 mb-1">
              Subgenre
            </label>
            <Input
              id="subgenre"
              value={subgenre}
              onChange={(e) => setSubgenre(e.target.value)}
              className="bg-dark-200 border-gray-700 text-white"
              placeholder="Enter subgenre"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
              Price (€)
            </label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-dark-200 border-gray-700 text-white"
              placeholder="Enter ticket price"
            />
          </div>
          
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-300 mb-1">
              Max Price (€) - for price ranges
            </label>
            <Input
              id="maxPrice"
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="bg-dark-200 border-gray-700 text-white"
              placeholder="Enter maximum ticket price (if range)"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="ticketUrl" className="block text-sm font-medium text-gray-300 mb-1">
              Ticket URL
            </label>
            <Input
              id="ticketUrl"
              type="url"
              value={ticketUrl}
              onChange={(e) => setTicketUrl(e.target.value)}
              className="bg-dark-200 border-gray-700 text-white"
              placeholder="Enter ticket purchase URL"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">
              Image URL
            </label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-dark-200 border-gray-700 text-white"
              placeholder="Enter image URL"
            />
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded bg-dark-200 border-gray-700 text-primary"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-300">
                Feature this event
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] bg-dark-200 border-gray-700 text-white"
            placeholder="Enter event description"
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Add Event"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
