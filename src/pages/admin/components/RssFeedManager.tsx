
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Tag, Eye, EyeOff, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RssItem {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  author: string | null;
  url: string | null;
  image_url: string | null;
  published_date: string | null;
  is_published: boolean;
  is_deleted: boolean;
  created_at: string;
  feed_id: string;
}

const RssFeedManager = () => {
  const [rssItems, setRssItems] = useState<RssItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRssItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rss_items')
        .select('*')
        .eq('is_deleted', false)
        .order('published_date', { ascending: false });

      if (error) throw error;
      setRssItems(data || []);
    } catch (error) {
      console.error('Error fetching RSS items:', error);
      toast.error('Failed to fetch RSS items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRssItems();
  }, []);

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('rss_items')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Item ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      fetchRssItems();
    } catch (error) {
      console.error('Error updating publish status:', error);
      toast.error('Failed to update publish status');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rss_items')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Item deleted successfully');
      fetchRssItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  // Get available months from the data
  const availableMonths = Array.from(new Set(
    rssItems
      .filter(item => item.published_date)
      .map(item => {
        const date = new Date(item.published_date!);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
  )).sort().reverse();

  // Filter items based on search and month
  const filteredItems = rssItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMonth = !selectedMonth || 
                        (item.published_date && 
                         item.published_date.startsWith(selectedMonth));
    
    return matchesSearch && matchesMonth;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString();
  };

  const getMonthLabel = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">RSS Feed Manager</h2>
        <Button onClick={fetchRssItems} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search RSS items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-dark-200 border-gray-700 text-white"
          />
        </div>
        
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="bg-dark-200 border-gray-700 text-white">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-gray-700">
            <SelectItem value="">All months</SelectItem>
            {availableMonths.map(month => (
              <SelectItem key={month} value={month}>
                {getMonthLabel(month)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-dark-300 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{filteredItems.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-300 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">
              {filteredItems.filter(item => item.is_published).length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-300 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Unpublished</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-400">
              {filteredItems.filter(item => !item.is_published).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RSS Items List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No RSS items found
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="bg-dark-300 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      {item.excerpt && (
                        <p className="text-gray-300 text-sm mb-2 line-clamp-2">{item.excerpt}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                        {item.author && (
                          <span className="flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {item.author}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.published_date)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Badge 
                        variant={item.is_published ? "default" : "secondary"}
                        className={item.is_published ? "bg-green-600" : "bg-yellow-600"}
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublishStatus(item.id, item.is_published)}
                        className={`${
                          item.is_published 
                            ? "text-yellow-400 hover:text-yellow-300" 
                            : "text-green-400 hover:text-green-300"
                        }`}
                      >
                        {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View original article →
                    </a>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RssFeedManager;
