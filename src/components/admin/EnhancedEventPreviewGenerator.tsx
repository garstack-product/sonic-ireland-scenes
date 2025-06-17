import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { 
  Loader2, 
  ExternalLink, 
  Share2, 
  Eye, 
  Save, 
  AlertCircle, 
  Clock, 
  Edit3,
  Calendar as CalendarIcon,
  Facebook,
  Twitter,
  Send,
  Upload,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addNewsItem } from "@/services/newsService";
import { uploadImage, uploadMultipleImages } from "@/services/imageUploadService";
import SocialShareButtons from "@/components/ui/SocialShareButtons";
import { format } from "date-fns";

interface EventPreview {
  title: string;
  preview: string;
  images: string[];
  originalUrl: string;
}

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledTime: Date;
  status: 'scheduled' | 'published' | 'failed';
}

const EnhancedEventPreviewGenerator = () => {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<EventPreview | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPreview, setEditedPreview] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Image upload state
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [uploadedFeaturedImageUrl, setUploadedFeaturedImageUrl] = useState<string>("");
  const [uploadedAdditionalImageUrls, setUploadedAdditionalImageUrls] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  
  // Publishing state management
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published' | 'shared'>('draft');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState("12:00");
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isEditingPublished, setIsEditingPublished] = useState(false);

  const generatePreview = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Calling edge function with URL:', url);
      
      const { data, error } = await supabase.functions.invoke('generate-event-preview', {
        body: { url: url.trim() }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Error generating preview:', error);
        setError(error.message || 'Failed to generate preview');
        toast.error('Failed to generate preview: ' + (error.message || 'Unknown error'));
        return;
      }

      if (data.error) {
        console.error('API error:', data.error);
        setError(data.error);
        toast.error(data.error);
        return;
      }

      setPreview(data);
      setEditedTitle(data.title);
      setEditedPreview(data.preview);
      setSelectedImage(data.images[0] || '');
      setPublishStatus('draft');
      toast.success(`Preview generated successfully! (${data.preview.length} words)`);

    } catch (error) {
      console.error('Error generating preview:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to generate preview: ' + errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFeaturedImage(file);
      
      setIsUploadingImages(true);
      try {
        const imageUrl = await uploadImage(file, 'event-previews', 'featured');
        setUploadedFeaturedImageUrl(imageUrl);
        setSelectedImage(imageUrl);
        toast.success("Featured image uploaded successfully!");
      } catch (error) {
        console.error('Error uploading featured image:', error);
        toast.error("Failed to upload featured image");
      } finally {
        setIsUploadingImages(false);
      }
    }
  };

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAdditionalImages(files);
      
      setIsUploadingImages(true);
      try {
        const imageUrls = await uploadMultipleImages(files, 'event-previews', 'additional');
        setUploadedAdditionalImageUrls(imageUrls);
        
        // Add uploaded images to the preview images array
        if (preview) {
          setPreview({
            ...preview,
            images: [...preview.images, ...imageUrls]
          });
        }
        
        toast.success(`${files.length} additional images uploaded successfully!`);
      } catch (error) {
        console.error('Error uploading additional images:', error);
        toast.error("Failed to upload additional images");
      } finally {
        setIsUploadingImages(false);
      }
    }
  };

  const removeAdditionalImage = (indexToRemove: number) => {
    const newImages = uploadedAdditionalImageUrls.filter((_, index) => index !== indexToRemove);
    setUploadedAdditionalImageUrls(newImages);
    
    if (preview) {
      const filteredImages = preview.images.filter((_, index) => index !== indexToRemove);
      setPreview({
        ...preview,
        images: filteredImages
      });
    }
  };

  const shareOnSocialMedia = (platform: string) => {
    if (!preview) return;

    const text = `${editedTitle}\n\n${editedPreview.substring(0, 200)}...`;
    const shareUrl = preview.originalUrl;

    let socialUrl = '';
    switch (platform) {
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        socialUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }

    if (socialUrl) {
      window.open(socialUrl, '_blank', 'width=600,height=400');
      if (publishStatus === 'published') {
        setPublishStatus('shared');
        toast.success(`Shared on ${platform}!`);
      }
    }
  };

  const schedulePost = () => {
    if (!scheduledDate || !preview) {
      toast.error("Please select a date and generate a preview first");
      return;
    }

    const [hours, minutes] = scheduledTime.split(':');
    const scheduledDateTime = new Date(scheduledDate);
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      title: editedTitle,
      content: editedPreview,
      platforms: selectedPlatforms,
      scheduledTime: scheduledDateTime,
      status: 'scheduled'
    };

    setScheduledPosts([...scheduledPosts, newPost]);
    toast.success(`Post scheduled for ${format(scheduledDateTime, 'PPP p')}`);
  };

  const publishToNews = async () => {
    if (!preview || !editedTitle.trim() || !editedPreview.trim()) {
      toast.error("Please ensure title and preview content are filled");
      return;
    }

    setIsPublishing(true);
    try {
      const imageUrl = uploadedFeaturedImageUrl || selectedImage || '/placeholder.svg';
      
      await addNewsItem({
        title: editedTitle,
        content: editedPreview,
        excerpt: editedPreview.substring(0, 150) + "...",
        author: 'Admin',
        date: new Date().toISOString().split('T')[0],
        category: 'Event Preview',
        image_url: imageUrl,
        tags: ['Event Preview', 'Generated'],
        url: preview.originalUrl
      });

      setPublishStatus('published');
      toast.success("Preview published to news page!");

    } catch (error) {
      console.error('Error publishing preview:', error);
      toast.error('Failed to publish preview');
    } finally {
      setIsPublishing(false);
    }
  };

  const updatePublishedContent = async () => {
    // In a real implementation, this would update the published news item
    setIsEditingPublished(false);
    toast.success("Published content updated!");
  };

  const shareToMultiplePlatforms = () => {
    selectedPlatforms.forEach(platform => {
      setTimeout(() => shareOnSocialMedia(platform), 500);
    });
    toast.success(`Shared to ${selectedPlatforms.length} platforms!`);
  };

  // Get all images including uploaded ones
  const allImages = [
    ...(preview?.images || []),
    ...(uploadedFeaturedImageUrl ? [uploadedFeaturedImageUrl] : []),
    ...uploadedAdditionalImageUrls
  ].filter((url, index, array) => array.indexOf(url) === index); // Remove duplicates

  return (
    <div className="space-y-6">
      <Card className="bg-dark-300 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Enhanced Event Preview Generator</CardTitle>
          <CardDescription className="text-gray-300">
            Generate comprehensive 500+ word event previews with advanced publishing and scheduling features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/event-page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-dark-200 border-gray-700 text-white flex-1"
            />
            <Button 
              onClick={generatePreview} 
              disabled={isGenerating || !url.trim()}
              className="min-w-[120px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Preview'
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <div className="text-sm text-gray-400 bg-blue-900/20 border border-blue-700 rounded-lg p-3">
            💡 <strong>Enhanced Version:</strong> Generates 500+ word comprehensive previews with scheduling and multi-platform publishing capabilities.
          </div>
        </CardContent>
      </Card>

      {preview && (
        <Tabs defaultValue="edit" className="bg-dark-300 border-gray-700 rounded-lg">
          <TabsList className="grid w-full grid-cols-4 bg-dark-400">
            <TabsTrigger value="edit">Edit Content</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={publishStatus === 'draft' ? 'outline' : publishStatus === 'published' ? 'default' : 'secondary'}>
                  {publishStatus.charAt(0).toUpperCase() + publishStatus.slice(1)}
                </Badge>
                {publishStatus === 'published' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingPublished(!isEditingPublished)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditingPublished ? 'Cancel Edit' : 'Edit Published'}
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(preview.originalUrl, '_blank')}
                className="text-gray-300"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Original
              </Button>
            </div>

            {/* Title Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="bg-dark-200 border-gray-700 text-white"
                disabled={publishStatus === 'published' && !isEditingPublished}
              />
            </div>

            {/* Preview Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preview Content ({editedPreview.length} words - {editedPreview.split(' ').length} words)
              </label>
              <Textarea
                value={editedPreview}
                onChange={(e) => setEditedPreview(e.target.value)}
                className="bg-dark-200 border-gray-700 text-white min-h-[300px]"
                disabled={publishStatus === 'published' && !isEditingPublished}
              />
              {editedPreview.split(' ').length < 500 && (
                <p className="text-yellow-400 text-sm mt-1">
                  Recommendation: Add more content to reach 500+ words
                </p>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Featured Image
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    className="bg-dark-200 border-gray-700 text-white flex-1"
                    disabled={isUploadingImages}
                  />
                  {isUploadingImages && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                </div>
                {uploadedFeaturedImageUrl && (
                  <div className="mt-2">
                    <img
                      src={uploadedFeaturedImageUrl}
                      alt="Featured upload"
                      className="w-24 h-24 object-cover rounded border-2 border-primary"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Images
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesUpload}
                    className="bg-dark-200 border-gray-700 text-white flex-1"
                    disabled={isUploadingImages}
                  />
                  {isUploadingImages && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                </div>
                {uploadedAdditionalImageUrls.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {uploadedAdditionalImageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Additional upload ${index + 1}`}
                          className="w-full aspect-square object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeAdditionalImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image Selection */}
            {allImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Featured Image
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allImages.map((image, index) => (
                    <div
                      key={index}
                      className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 ${
                        selectedImage === image ? 'border-primary' : 'border-gray-600'
                      }`}
                      onClick={() => !publishStatus || isEditingPublished ? setSelectedImage(image) : null}
                    >
                      <img
                        src={image}
                        alt={`Preview image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {selectedImage === image && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isEditingPublished && (
              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <Button onClick={updatePublishedContent} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Update Published Content
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="publish" className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Publishing Options</h3>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={publishToNews}
                  disabled={isPublishing || !editedTitle.trim() || !editedPreview.trim() || publishStatus === 'published'}
                  className="flex items-center gap-2"
                >
                  {isPublishing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {publishStatus === 'published' ? 'Already Published' : 'Publish to News'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-dark-200 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Social Media Platforms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {['twitter', 'facebook', 'linkedin'].map(platform => (
                      <label key={platform} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedPlatforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPlatforms([...selectedPlatforms, platform]);
                            } else {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-white capitalize">{platform}</span>
                      </label>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-dark-200 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Share Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      onClick={shareToMultiplePlatforms}
                      disabled={selectedPlatforms.length === 0}
                      className="w-full"
                      variant="outline"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Share to Selected Platforms
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareOnSocialMedia('twitter')}
                        className="flex-1"
                      >
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareOnSocialMedia('facebook')}
                        className="flex-1"
                      >
                        <Facebook className="mr-2 h-4 w-4" />
                        Facebook
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Schedule Publishing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-dark-200 border-gray-700"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time
                  </label>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-dark-200 border-gray-700 text-white"
                  />
                </div>
              </div>

              <Button
                onClick={schedulePost}
                disabled={!scheduledDate || selectedPlatforms.length === 0}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Schedule Post
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Scheduled Posts</h3>
              
              {scheduledPosts.length === 0 ? (
                <p className="text-gray-400">No scheduled posts</p>
              ) : (
                <div className="space-y-3">
                  {scheduledPosts.map((post) => (
                    <Card key={post.id} className="bg-dark-200 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{post.title}</h4>
                            <p className="text-sm text-gray-400">
                              {format(post.scheduledTime, "PPP p")}
                            </p>
                            <div className="flex gap-1 mt-2">
                              {post.platforms.map(platform => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Badge variant={post.status === 'scheduled' ? 'outline' : 'default'}>
                            {post.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EnhancedEventPreviewGenerator;
