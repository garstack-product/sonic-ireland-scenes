
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AddFestivalReview = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [venue, setVenue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0]);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAdditionalImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Here you would handle the upload to Supabase
    // For now we'll just simulate a response

    setTimeout(() => {
      toast.success("Festival review added successfully!");
      setIsSubmitting(false);
      
      // Reset form
      setTitle("");
      setArtist("");
      setVenue("");
      setStartDate("");
      setEndDate("");
      setContent("");
      setFeaturedImage(null);
      setAdditionalImages([]);
    }, 1500);
  };

  const handlePasteFromHTML = () => {
    // This would be enhanced to parse HTML content
    navigator.clipboard.readText().then(
      text => {
        // Simple HTML strip - in a real app you'd use a proper HTML parser
        const strippedText = text.replace(/<[^>]*>?/gm, '');
        setContent(strippedText);
        toast.success("Content pasted from clipboard");
      },
      () => {
        toast.error("Failed to read clipboard");
      }
    );
  };

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-6">Add New Festival Review</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Festival Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-dark-200 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-300 mb-1">
              Headline Artists
            </label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
              className="bg-dark-200 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-1">
              Location
            </label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              className="bg-dark-200 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
              Start Date
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
              End Date
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
          
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-300 mb-1">
              Featured Image
            </label>
            <Input
              id="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleFeaturedImageChange}
              required
              className="bg-dark-200 border-gray-700 text-white"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="additionalImages" className="block text-sm font-medium text-gray-300 mb-1">
            Additional Images
          </label>
          <Input
            id="additionalImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesChange}
            className="bg-dark-200 border-gray-700 text-white"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300">
              Review Content
            </label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handlePasteFromHTML}
            >
              Paste from HTML
            </Button>
          </div>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="min-h-[300px] bg-dark-200 border-gray-700 text-white"
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Add Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddFestivalReview;
