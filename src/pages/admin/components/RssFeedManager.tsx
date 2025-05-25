
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getRssFeeds, getRssItems, publishRssItem, deleteRssItem } from "@/services/rssService";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Eye, RefreshCw } from "lucide-react";

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

const RssFeedManager = () => {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [items, setItems] = useState<RssItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

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

  const handleFetchRssFeeds = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-rss');
      
      if (error) {
        console.error('Error fetching RSS feeds:', error);
        toast.error('Failed to fetch RSS feeds');
      } else {
        toast.success('RSS feeds fetched successfully');
        fetchData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error invoking RSS fetch function:', error);
      toast.error('Failed to fetch RSS feeds');
    } finally {
      setIsFetching(false);
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">RSS Feed Management</h2>
        <Button 
          onClick={handleFetchRssFeeds} 
          disabled={isFetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Fetching...' : 'Fetch RSS Feeds'}
        </Button>
      </div>

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
              <div className="flex justify-between items-center">
                <Badge variant={feed.is_active ? "default" : "secondary"}>
                  {feed.is_active ? "Active" : "Inactive"}
                </Badge>
                {feed.last_fetched && (
                  <span className="text-xs text-gray-500">
                    Last: {new Date(feed.last_fetched).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-dark-300 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-white mb-4">RSS Feed Items</h3>
        
        {items.length === 0 ? (
          <p className="text-gray-400">No RSS items found. Click "Fetch RSS Feeds" to load items.</p>
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
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        {item.author && <span>By {item.author}</span>}
                        {item.published_date && (
                          <span>{new Date(item.published_date).toLocaleDateString()}</span>
                        )}
                      </div>
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

export default RssFeedManager;
