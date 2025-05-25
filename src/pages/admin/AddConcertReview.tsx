
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addConcertReview } from "@/services/concertReviewService";
import { uploadImage } from "@/services/imageUploadService";

const AddConcertReview = () => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    venue: "",
    date: "",
    time: "",
    content: "",
    imageUrl: "/placeholder.svg"
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = '/placeholder.svg';
      
      if (featuredImage) {
        imageUrl = await uploadImage(featuredImage, 'reviews', 'concerts');
      }

      await addConcertReview({
        title: formData.title,
        artist: formData.artist,
        venue: formData.venue,
        date: formData.date,
        image_url: imageUrl,
        content: formData.content,
      });
      
      toast.success("Review added successfully!");
      
      // Reset form
      setFormData({
        title: "",
        artist: "",
        venue: "",
        date: "",
        time: "",
        content: "",
        imageUrl: "/placeholder.svg"
      });
      setFeaturedImage(null);
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error("Failed to add review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-6">Add New Concert Review</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-dark-200 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-300 mb-1">
              Artist
            </label>
            <Input
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              required
              className="bg-dark-200 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-1">
              Venue
            </label>
            <Input
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              className="bg-dark-200 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="bg-dark-200 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
              Time
            </label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
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
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
            Review Content
          </label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
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

export default AddConcertReview;
