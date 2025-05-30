
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getNewsItems } from "@/services/newsService";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  date: string;
  category?: string;
  image_url?: string;
  tags?: string[];
  created_at: string;
  url?: string;
}

const ManageNewsItems = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadNewsItems = async () => {
    try {
      setIsLoading(true);
      const items = await getNewsItems();
      setNewsItems(items);
    } catch (error) {
      console.error('Error loading news items:', error);
      toast.error('Failed to load news items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNewsItems();
  }, []);

  const deleteNewsItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('News item deleted successfully');
      await loadNewsItems();
    } catch (error) {
      console.error('Error deleting news item:', error);
      toast.error('Failed to delete news item');
    }
  };

  const filteredItems = newsItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Manage News Items</h2>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search news items..."
            className="pl-10 bg-dark-200 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No news items found
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="bg-dark-200 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNewsItem(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                {item.excerpt && (
                  <p className="text-gray-300 mb-3 line-clamp-2">{item.excerpt}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    {item.category || 'General'}
                  </Badge>
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    By: {item.author || 'Admin'}
                  </Badge>
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    {new Date(item.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageNewsItems;
