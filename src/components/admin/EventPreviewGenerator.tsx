
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ExternalLink, Share2, Eye, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addNewsItem } from "@/services/newsService";

interface EventPreview {
  title: string;
  preview: string;
  images: string[];
  originalUrl: string;
}

const EventPreviewGenerator = () => {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<EventPreview | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPreview, setEditedPreview] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const generatePreview = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-event-preview', {
        body: { url: url.trim() }
      });

      if (error) {
        console.error('Error generating preview:', error);
        toast.error('Failed to generate preview');
        return;
      }

      setPreview(data);
      setEditedTitle(data.title);
      setEditedPreview(data.preview);
      setSelectedImage(data.images[0] || '');
      toast.success("Preview generated successfully!");

    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate preview');
    } finally {
      setIsGenerating(false);
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
    }
  };

  const publishToNews = async () => {
    if (!preview || !editedTitle.trim() || !editedPreview.trim()) {
      toast.error("Please ensure title and preview content are filled");
      return;
    }

    setIsPublishing(true);
    try {
      await addNewsItem({
        title: editedTitle,
        content: editedPreview,
        excerpt: editedPreview.substring(0, 150) + "...",
        author: 'Admin',
        date: new Date().toISOString().split('T')[0],
        category: 'Event Preview',
        image_url: selectedImage || '/placeholder.svg',
        tags: ['Event Preview', 'Generated'],
        url: preview.originalUrl
      });

      toast.success("Preview published to news page!");
      
      // Reset form
      setUrl("");
      setPreview(null);
      setEditedTitle("");
      setEditedPreview("");
      setSelectedImage("");

    } catch (error) {
      console.error('Error publishing preview:', error);
      toast.error('Failed to publish preview');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-dark-300 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">AI Event Preview Generator</CardTitle>
          <CardDescription className="text-gray-300">
            Enter an event URL to generate an AI-powered preview with images
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
        </CardContent>
      </Card>

      {preview && (
        <Card className="bg-dark-300 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Generated Preview</CardTitle>
              <div className="flex gap-2">
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
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="bg-dark-200 border-gray-700 text-white"
              />
            </div>

            {/* Preview Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preview Content ({editedPreview.length} characters)
              </label>
              <Textarea
                value={editedPreview}
                onChange={(e) => setEditedPreview(e.target.value)}
                className="bg-dark-200 border-gray-700 text-white min-h-[150px]"
              />
            </div>

            {/* Image Selection */}
            {preview.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Featured Image
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {preview.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 ${
                        selectedImage === image ? 'border-primary' : 'border-gray-600'
                      }`}
                      onClick={() => setSelectedImage(image)}
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

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
              <Button
                onClick={publishToNews}
                disabled={isPublishing || !editedTitle.trim() || !editedPreview.trim()}
                className="flex items-center gap-2"
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Publish to News
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocialMedia('twitter')}
                  className="text-gray-300"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocialMedia('facebook')}
                  className="text-gray-300"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocialMedia('linkedin')}
                  className="text-gray-300"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  LinkedIn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventPreviewGenerator;
