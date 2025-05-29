
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Loader2, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getRssFeeds, getRssItems, addRssFeed, toggleFeedActive, publishRssItem, deleteRssItem, unpublishRssItem } from "@/services/rssService";

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
  rss_feeds?: { name: string };
}

const RssFeedManager = () => {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [items, setItems] = useState<RssItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeed, setSelectedFeed] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingFeed, setIsAddingFeed] = useState(false);

  const loadFeeds = async () => {
    try {
      const feedsData = await getRssFeeds();
      setFeeds(feedsData);
    } catch (error) {
      console.error('Error loading feeds:', error);
      toast.error('Failed to load RSS feeds');
    }
  };

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const itemsData = await getRssItems(searchTerm, selectedFeed, selectedMonth);
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load RSS items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeeds();
  }, []);

  useEffect(() => {
    loadItems();
  }, [searchTerm, selectedFeed, selectedMonth]);

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedName.trim() || !newFeedUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsAddingFeed(true);
      await addRssFeed(newFeedName, newFeedUrl);
      toast.success('RSS feed added successfully');
      setNewFeedName("");
      setNewFeedUrl("");
      await loadFeeds();
    } catch (error) {
      console.error('Error adding feed:', error);
      toast.error('Failed to add RSS feed');
    } finally {
      setIsAddingFeed(false);
    }
  };

  const handleToggleFeedActive = async (feedId: string, isActive: boolean) => {
    try {
      await toggleFeedActive(feedId, !isActive);
      toast.success(`Feed ${!isActive ? 'activated' : 'deactivated'} successfully`);
      await loadFeeds();
    } catch (error) {
      console.error('Error toggling feed:', error);
      toast.error('Failed to update feed status');
    }
  };

  const handlePublishItem = async (itemId: string) => {
    try {
      await publishRssItem(itemId);
      toast.success('Item published to news successfully');
      await loadItems();
    } catch (error) {
      console.error('Error publishing item:', error);
      toast.error('Failed to publish item');
    }
  };

  const handleUnpublishItem = async (itemId: string) => {
    try {
      await unpublishRssItem(itemId);
      toast.success('Item unpublished from news successfully');
      await loadItems();
    } catch (error) {
      console.error('Error unpublishing item:', error);
      toast.error('Failed to unpublish item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteRssItem(itemId);
      toast.success('Item deleted successfully');
      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  // Generate chronological month options (Year - Month format, newest first)
  const generateMonthOptions = () => {
    const options = [{ value: "all", label: "All Months" }];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Generate 24 months (2 years worth)
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      
      options.push({
        value: month.toString(),
        label: `${year} - ${monthName}`
      });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-6">Manage RSS Feeds</h2>
      
      {/* Add Feed Form */}
      <form onSubmit={handleAddFeed} className="mb-6 p-4 bg-dark-200 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-4">Add New RSS Feed</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Feed Name"
            value={newFeedName}
            onChange={(e) => setNewFeedName(e.target.value)}
            className="bg-dark-100 border-gray-700 text-white"
            required
          />
          <Input
            placeholder="RSS Feed URL"
            value={newFeedUrl}
            onChange={(e) => setNewFeedUrl(e.target.value)}
            className="bg-dark-100 border-gray-700 text-white"
            required
          />
          <Button type="submit" disabled={isAddingFeed}>
            {isAddingFeed ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Feed
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Feeds List */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4">RSS Feeds ({feeds.length})</h3>
        <div className="space-y-2">
          {feeds.map((feed) => (
            <div key={feed.id} className="flex items-center justify-between p-3 bg-dark-200 rounded-lg">
              <div>
                <span className="text-white font-medium">{feed.name}</span>
                <span className="text-gray-400 text-sm ml-2">({feed.url})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${feed.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                  {feed.is_active ? 'Active' : 'Inactive'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleFeedActive(feed.id, feed.is_active)}
                  className="text-white border-gray-600 hover:bg-dark-100"
                >
                  {feed.is_active ? (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search items..."
            className="pl-10 bg-dark-200 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedFeed} onValueChange={setSelectedFeed}>
          <SelectTrigger className="bg-dark-200 border-gray-700 text-white">
            <SelectValue placeholder="Select feed..." />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-gray-700">
            <SelectItem value="all">All Feeds</SelectItem>
            {feeds.map((feed) => (
              <SelectItem key={feed.id} value={feed.id}>
                {feed.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="bg-dark-200 border-gray-700 text-white">
            <SelectValue placeholder="Select month..." />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-gray-700">
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items List */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">RSS Items ({items.length})</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No RSS items found</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="p-4 bg-dark-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{item.title}</h4>
                    {item.rss_feeds && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {item.rss_feeds.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant={item.is_published ? "default" : "outline"}
                      size="sm"
                      onClick={() => item.is_published ? handleUnpublishItem(item.id) : handlePublishItem(item.id)}
                      className={item.is_published 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "bg-white text-black hover:bg-gray-100"
                      }
                    >
                      {item.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                {item.excerpt && (
                  <p className="text-gray-300 text-sm mb-2">{item.excerpt.substring(0, 200)}...</p>
                )}
                <div className="text-xs text-gray-400">
                  {item.author && <span>By {item.author} • </span>}
                  {item.published_date && <span>{new Date(item.published_date).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RssFeedManager;
