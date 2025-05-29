import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getRssFeeds, getRssItems, publishRssItem, unpublishRssItem, deleteRssItem, addRssFeed, toggleFeedActive } from "@/services/rssService";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Eye, EyeOff, RefreshCw, Plus, Search, Filter } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isAddingFeed, setIsAddingFeed] = useState(false);
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeed, setSelectedFeed] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    fetchData();
    addExampleFeeds();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [searchTerm, selectedFeed, selectedMonth]);

  const addExampleFeeds = async () => {
    try {
      const existingFeeds = await getRssFeeds();
      if (existingFeeds.length === 0) {
        await addRssFeed("NME Music News", "https://www.nme.com/feed");
        await addRssFeed("BBC Music News", "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml");
        await addRssFeed("Pitchfork", "https://pitchfork.com/rss/news/");
        fetchData();
      }
    } catch (error) {
      console.error('Error adding example feeds:', error);
    }
  };

  const fetchData = async () => {
    try {
      const feedsData = await getRssFeeds();
      setFeeds(feedsData);
    } catch (error) {
      console.error('Error fetching RSS feeds:', error);
      toast.error('Failed to load RSS feeds');
    }
  };

  const fetchItems = async () => {
    try {
      const itemsData = await getRssItems(searchTerm, selectedFeed, selectedMonth);
      setItems(itemsData);
    } catch (error) {
      console.error('Error fetching RSS items:', error);
      toast.error('Failed to load RSS items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFeedName.trim() || !newFeedUrl.trim()) {
      toast.error('Please provide both name and URL');
      return;
    }

    setIsAddingFeed(true);
    try {
      await addRssFeed(newFeedName.trim(), newFeedUrl.trim());
      toast.success('RSS feed added successfully');
      setNewFeedName("");
      setNewFeedUrl("");
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      console.error('Error adding RSS feed:', error);
      toast.error('Failed to add RSS feed');
    } finally {
      setIsAddingFeed(false);
    }
  };

  const handleToggleActive = async (feedId: string, currentActive: boolean) => {
    try {
      await toggleFeedActive(feedId, !currentActive);
      toast.success(`Feed ${!currentActive ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch (error) {
      console.error('Error toggling feed status:', error);
      toast.error('Failed to update feed status');
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
        fetchItems();
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
      fetchItems();
    } catch (error) {
      console.error('Error publishing RSS item:', error);
      toast.error('Failed to publish RSS item');
    }
  };

  const handleUnpublishItem = async (itemId: string) => {
    try {
      await unpublishRssItem(itemId);
      toast.success('RSS item unpublished from news');
      fetchItems();
    } catch (error) {
      console.error('Error unpublishing RSS item:', error);
      toast.error('Failed to unpublish RSS item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteRssItem(itemId);
      toast.success('RSS item deleted');
      fetchItems();
    } catch (error) {
      console.error('Error deleting RSS item:', error);
      toast.error('Failed to delete RSS item');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getMonthOptions = () => {
    const months = [
      { value: "all", label: "All Months" }
    ];
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Generate months for current and previous year in chronological order (newest first)
    for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
      const year = currentYear - yearOffset;
      const startMonth = yearOffset === 0 ? currentMonth : 11;
      const endMonth = yearOffset === 1 ? Math.max(0, currentMonth - 12) : 0;
      
      for (let month = startMonth; month >= endMonth; month--) {
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        
        months.push({
          value: (month + 1).toString(),
          label: `${year} - ${monthNames[month]}`
        });
      }
    }
    
    return months;
  };

  if (isLoading) {
    return <div className="text-white">Loading RSS feeds...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">RSS Feed Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Feed
          </Button>
          <Button 
            onClick={handleFetchRssFeeds} 
            disabled={isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Fetching...' : 'Fetch RSS Feeds'}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="bg-dark-200 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Add New RSS Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFeed} className="space-y-4">
              <div>
                <Input
                  placeholder="Feed Name (e.g., NME Music News)"
                  value={newFeedName}
                  onChange={(e) => setNewFeedName(e.target.value)}
                  className="bg-dark-300 border-gray-600 text-white"
                />
              </div>
              <div>
                <Input
                  placeholder="RSS URL (e.g., https://www.nme.com/feed)"
                  value={newFeedUrl}
                  onChange={(e) => setNewFeedUrl(e.target.value)}
                  className="bg-dark-300 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isAddingFeed}>
                  {isAddingFeed ? 'Adding...' : 'Add Feed'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
              <div className="flex justify-between items-center mb-2">
                <Badge variant={feed.is_active ? "default" : "secondary"}>
                  {feed.is_active ? "Active" : "Inactive"}
                </Badge>
                <Switch
                  checked={feed.is_active}
                  onCheckedChange={(checked) => handleToggleActive(feed.id, feed.is_active)}
                />
              </div>
              {feed.last_fetched && (
                <span className="text-xs text-gray-500">
                  Last: {formatDate(feed.last_fetched)}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-dark-300 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-white mb-4">RSS Feed Items</h3>
        
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-dark-200 border-gray-600 text-white"
            />
          </div>
          
          <Select value={selectedFeed} onValueChange={setSelectedFeed}>
            <SelectTrigger className="bg-dark-200 border-gray-600 text-white">
              <SelectValue placeholder="Filter by feed" />
            </SelectTrigger>
            <SelectContent className="bg-dark-200 border-gray-600">
              <SelectItem value="all">All Feeds</SelectItem>
              {feeds.map((feed) => (
                <SelectItem key={feed.id} value={feed.id}>
                  {feed.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="bg-dark-200 border-gray-600 text-white">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent className="bg-dark-200 border-gray-600">
              {getMonthOptions().map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {items.length === 0 ? (
          <p className="text-gray-400">No RSS items found. Try adjusting your filters or click "Fetch RSS Feeds" to load items.</p>
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
                        {item.rss_feeds?.name && (
                          <Badge variant="outline" className="text-xs">
                            {item.rss_feeds.name}
                          </Badge>
                        )}
                        {item.author && <span>By {item.author}</span>}
                        {item.published_date && (
                          <span>{formatDate(item.published_date)}</span>
                        )}
                        {item.is_published && (
                          <Badge variant="default" className="text-xs">
                            Published
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!item.is_published ? (
                        <Button
                          size="sm"
                          onClick={() => handlePublishItem(item.id)}
                          className="flex items-center gap-1 bg-white text-black hover:bg-gray-200"
                        >
                          <Eye className="h-4 w-4" />
                          Publish
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleUnpublishItem(item.id)}
                          className="flex items-center gap-1 bg-green-600 text-white hover:bg-green-700"
                        >
                          <EyeOff className="h-4 w-4" />
                          Unpublish
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
