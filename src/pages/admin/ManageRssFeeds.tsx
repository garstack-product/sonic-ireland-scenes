
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getRssFeeds, getRssItems, addRssFeed, publishRssItem, deleteRssItem } from "@/services/rssService";
import { Trash2, Eye, EyeOff } from "lucide-react";

interface RssFeed {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
  last_fetched?: string;
  created_at: string;
}

interface RssItem {
  id: string;
  feed_id?: string;
  title: string;
  content?: string;
  excerpt?: string;
  author?: string;
  published_date?: string;
  url?: string;
  image_url?: string;
  is_published: boolean;
  is_deleted: boolean;
  created_at: string;
}

const ManageRssFeeds = () => {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [items, setItems] = useState<RssItem[]>([]);
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feedsData, itemsData] = await Promise.all([
        getRssFeeds(),
        getRssItems()
      ]);
      setFeeds(feedsData);
      setItems(itemsData);
    } catch (error) {
      console.error('Error fetching RSS data:', error);
      toast.error('Failed to load RSS data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addRssFeed(newFeedName, newFeedUrl);
      toast.success('RSS feed added successfully');
      setNewFeedName("");
      setNewFeedUrl("");
      fetchData();
    } catch (error) {
      console.error('Error adding RSS feed:', error);
      toast.error('Failed to add RSS feed');
    }
  };

  const handlePublishItem = async (itemId: string) => {
    try {
      await publishRssItem(itemId);
      toast.success('RSS item published to news');
      fetchData();
    } catch (error) {
      console.error('Error publishing RSS item:', error);
      toast.error('Failed to publish RSS item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteRssItem(itemId);
      toast.success('RSS item deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting RSS item:', error);
      toast.error('Failed to delete RSS item');
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading RSS feeds...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-dark-300 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-6">Manage RSS Feeds</h2>
        
        <form onSubmit={handleAddFeed} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Feed name (e.g., NME)"
              value={newFeedName}
              onChange={(e) => setNewFeedName(e.target.value)}
              required
              className="bg-dark-200 border-gray-700 text-white"
            />
            <Input
              placeholder="Feed URL"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              required
              className="bg-dark-200 border-gray-700 text-white"
            />
            <Button type="submit">Add Feed</Button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feeds.map((feed) => (
            <Card key={feed.id} className="bg-dark-200 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{feed.name}</CardTitle>
                <CardDescription className="text-gray-400 truncate">
                  {feed.url}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={feed.is_active ? "default" : "secondary"}>
                  {feed.is_active ? "Active" : "Inactive"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-dark-300 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-6">RSS Feed Items</h2>
        <p className="text-gray-400 mb-4">
          Note: RSS feed fetching will be implemented with a scheduled function. 
          For now, this shows the structure for managing RSS items.
        </p>
        
        {items.length === 0 ? (
          <p className="text-gray-400">No RSS items found. RSS fetching functionality will be added.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="bg-dark-200 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                      {item.excerpt && (
                        <CardDescription className="text-gray-400 mt-2">
                          {item.excerpt}
                        </CardDescription>
                      )}
                      {item.author && (
                        <p className="text-gray-500 text-sm mt-1">By {item.author}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!item.is_published && (
                        <Button
                          size="sm"
                          onClick={() => handlePublishItem(item.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Publish
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRssFeeds;
