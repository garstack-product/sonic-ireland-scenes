import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Calendar, ExternalLink, RefreshCw, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRssFeeds, getRssItems, addRssFeed, toggleFeedActive, publishRssItem, unpublishRssItem, deleteRssItem } from "@/services/rssService";

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

const ManageRssFeeds = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeed, setSelectedFeed] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [editingFeed, setEditingFeed] = useState<RssFeed | null>(null);
  const [editFeedName, setEditFeedName] = useState("");
  const [editFeedUrl, setEditFeedUrl] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch RSS feeds
  const { data: feeds = [], isLoading: feedsLoading, refetch: refetchFeeds } = useQuery({
    queryKey: ['rssFeeds'],
    queryFn: getRssFeeds,
  });

  // Fetch RSS items
  const { data: rssItems = [], isLoading: itemsLoading, refetch: refetchItems } = useQuery({
    queryKey: ['rssItems', searchTerm, selectedFeed, selectedMonth],
    queryFn: () => getRssItems(searchTerm, selectedFeed, selectedMonth),
  });

  const handleAddFeed = async () => {
    if (!newFeedName.trim() || !newFeedUrl.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addRssFeed(newFeedName.trim(), newFeedUrl.trim());
      toast.success('RSS feed added successfully');
      
      // Reset form
      setNewFeedName("");
      setNewFeedUrl("");
      setIsAddDialogOpen(false);
      
      // Refetch data
      refetchFeeds();
    } catch (error) {
      console.error('Error adding RSS feed:', error);
      toast.error('Failed to add RSS feed');
    }
  };

  const handleEditFeed = (feed: RssFeed) => {
    setEditingFeed(feed);
    setEditFeedName(feed.name);
    setEditFeedUrl(feed.url);
    setIsEditDialogOpen(true);
  };

  const handleUpdateFeed = async () => {
    if (!editingFeed || !editFeedName.trim() || !editFeedUrl.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Update feed using Supabase
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from('rss_feeds')
        .update({ 
          name: editFeedName.trim(), 
          url: editFeedUrl.trim() 
        })
        .eq('id', editingFeed.id);

      if (error) throw error;

      toast.success('RSS feed updated successfully');
      
      // Reset form
      setEditingFeed(null);
      setEditFeedName("");
      setEditFeedUrl("");
      setIsEditDialogOpen(false);
      
      // Refetch data
      refetchFeeds();
    } catch (error) {
      console.error('Error updating RSS feed:', error);
      toast.error('Failed to update RSS feed');
    }
  };

  const handleDeleteFeed = async (feedId: string, feedName: string) => {
    if (!confirm(`Are you sure you want to delete the RSS feed "${feedName}"? This will also delete all associated RSS items.`)) {
      return;
    }

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      // First delete all RSS items associated with this feed
      await supabase
        .from('rss_items')
        .delete()
        .eq('feed_id', feedId);

      // Then delete the feed
      const { error } = await supabase
        .from('rss_feeds')
        .delete()
        .eq('id', feedId);

      if (error) throw error;

      toast.success('RSS feed deleted successfully');
      refetchFeeds();
      refetchItems();
    } catch (error) {
      console.error('Error deleting RSS feed:', error);
      toast.error('Failed to delete RSS feed');
    }
  };

  const handleToggleFeedActive = async (feedId: string, isActive: boolean) => {
    try {
      await toggleFeedActive(feedId, !isActive);
      toast.success(`Feed ${!isActive ? 'activated' : 'deactivated'} successfully`);
      refetchFeeds();
    } catch (error) {
      console.error('Error toggling feed status:', error);
      toast.error('Failed to update feed status');
    }
  };

  const handlePublishItem = async (itemId: string) => {
    try {
      await publishRssItem(itemId);
      toast.success('Item published successfully');
      refetchItems();
    } catch (error) {
      console.error('Error publishing item:', error);
      toast.error('Failed to publish item');
    }
  };

  const handleUnpublishItem = async (itemId: string) => {
    try {
      await unpublishRssItem(itemId);
      toast.success('Item unpublished successfully');
      refetchItems();
    } catch (error) {
      console.error('Error unpublishing item:', error);
      toast.error('Failed to unpublish item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await deleteRssItem(itemId);
      toast.success('Item deleted successfully');
      refetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const monthOptions = [
    { value: "all", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const handleSyncFeeds = async () => {
    setIsSyncing(true);
    try {
      console.log("Starting RSS feeds sync...");
      
      // Call the RSS sync edge function with proper headers
      const response = await fetch('https://eckohtoprkgolyjdiown.supabase.co/functions/v1/fetch-rss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja29odG9wcmtnb2x5amRpb3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjUyNTcsImV4cCI6MjA2MDEwMTI1N30.-pEsBnwaXjqnuspEa8arMrxfRa4m9yMkJQuBAFY5VII'
        },
        body: JSON.stringify({})
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Sync failed with status: ${response.status}`, errorText);
        throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Sync result:", result);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast.success('RSS feeds synced successfully! New items have been fetched.');
      
      // Refresh the data
      refetchFeeds();
      refetchItems();
    } catch (error) {
      console.error('Error syncing RSS feeds:', error);
      toast.error(`Failed to sync RSS feeds: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Manage RSS Feeds</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleSyncFeeds} 
            disabled={isSyncing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Feeds'}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Feed
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-300 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New RSS Feed</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="feedName" className="text-gray-300">Feed Name</Label>
                  <Input
                    id="feedName"
                    value={newFeedName}
                    onChange={(e) => setNewFeedName(e.target.value)}
                    placeholder="Enter feed name"
                    className="bg-dark-200 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="feedUrl" className="text-gray-300">Feed URL</Label>
                  <Input
                    id="feedUrl"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    placeholder="Enter RSS feed URL"
                    className="bg-dark-200 border-gray-700 text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddFeed}>
                    Add Feed
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Feed Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-dark-300 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit RSS Feed</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editFeedName" className="text-gray-300">Feed Name</Label>
              <Input
                id="editFeedName"
                value={editFeedName}
                onChange={(e) => setEditFeedName(e.target.value)}
                placeholder="Enter feed name"
                className="bg-dark-200 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="editFeedUrl" className="text-gray-300">Feed URL</Label>
              <Input
                id="editFeedUrl"
                value={editFeedUrl}
                onChange={(e) => setEditFeedUrl(e.target.value)}
                placeholder="Enter RSS feed URL"
                className="bg-dark-200 border-gray-700 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateFeed}>
                Update Feed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="feeds" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-dark-200">
          <TabsTrigger value="feeds" className="text-white data-[state=active]:bg-dark-100">RSS Feeds</TabsTrigger>
          <TabsTrigger value="items" className="text-white data-[state=active]:bg-dark-100">Feed Items</TabsTrigger>
        </TabsList>

        <TabsContent value="feeds" className="mt-6">
          {feedsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {feeds.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No RSS feeds found. Add your first feed to get started.
                </div>
              ) : (
                feeds.map((feed) => (
                  <div key={feed.id} className="bg-dark-200 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{feed.name}</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={feed.is_active ? "text-red-400 border-red-400 hover:bg-red-400 hover:text-white" : "text-green-400 border-green-400 hover:bg-green-400 hover:text-white"}
                          onClick={() => handleToggleFeedActive(feed.id, feed.is_active)}
                        >
                          {feed.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                          onClick={() => handleEditFeed(feed)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          onClick={() => handleDeleteFeed(feed.id, feed.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-3 break-all">{feed.url}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={feed.is_active ? "default" : "secondary"}>
                        {feed.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {feed.last_fetched && (
                        <Badge variant="outline" className="text-gray-400 border-gray-600">
                          Last fetched: {new Date(feed.last_fetched).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="items" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                <SelectValue placeholder="Select Feed" />
              </SelectTrigger>
              <SelectContent className="bg-dark-200 border-gray-700 text-white">
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
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent className="bg-dark-200 border-gray-700 text-white">
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {itemsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {rssItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No RSS items found.
                </div>
              ) : (
                rssItems.map((item) => (
                  <div key={item.id} className="bg-dark-200 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        {item.excerpt && (
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{item.excerpt}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {item.is_published ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-400 border-orange-400 hover:bg-orange-400 hover:text-white"
                            onClick={() => handleUnpublishItem(item.id)}
                          >
                            Unpublish
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                            onClick={() => handlePublishItem(item.id)}
                          >
                            Publish
                          </Button>
                        )}
                        {item.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                            onClick={() => window.open(item.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={item.is_published ? "default" : "secondary"}>
                        {item.is_published ? "Published" : "Draft"}
                      </Badge>
                      {item.rss_feeds?.name && (
                        <Badge variant="outline" className="text-gray-400 border-gray-600">
                          {item.rss_feeds.name}
                        </Badge>
                      )}
                      {item.author && (
                        <Badge variant="outline" className="text-gray-400 border-gray-600">
                          {item.author}
                        </Badge>
                      )}
                      {item.published_date && (
                        <Badge variant="outline" className="text-gray-400 border-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(item.published_date).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageRssFeeds;
