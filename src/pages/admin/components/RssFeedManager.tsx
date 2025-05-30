
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface RssFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  isActive: boolean;
  lastUpdated?: string;
}

const RssFeedManager = () => {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Safe category options with validation
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "music", label: "Music" },
    { value: "events", label: "Events" },
    { value: "festivals", label: "Festivals" },
    { value: "news", label: "News" }
  ].filter(option => {
    const isValid = option && 
                   option.value && 
                   typeof option.value === 'string' && 
                   option.value.trim().length > 0 &&
                   option.label &&
                   typeof option.label === 'string' &&
                   option.label.trim().length > 0;
    
    if (!isValid) {
      console.log(`RssFeedManager: Filtering out invalid category option:`, option);
    }
    return isValid;
  });

  console.log("RssFeedManager: Valid category options:", categoryOptions);

  const loadFeeds = async () => {
    try {
      setIsLoading(true);
      // Placeholder for RSS feed loading logic
      setFeeds([]);
    } catch (error) {
      console.error('Error loading RSS feeds:', error);
      toast.error('Failed to load RSS feeds');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeeds();
  }, []);

  const filteredFeeds = feeds.filter(feed => {
    const matchesSearch = feed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feed.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || feed.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-dark-300 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Manage RSS Feeds</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Feed
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search feeds..."
            className="pl-10 bg-dark-200 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-dark-200 border-gray-700 text-white">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-gray-700 text-white">
            {categoryOptions.length > 0 ? (
              categoryOptions.map((option) => {
                console.log(`RssFeedManager: Rendering SelectItem for category: "${option.value}"`);
                return (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="hover:bg-dark-100"
                  >
                    {option.label}
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem key="fallback-all" value="all" className="hover:bg-dark-100">
                All Categories
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeeds.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No RSS feeds found. Add your first feed to get started.
            </div>
          ) : (
            filteredFeeds.map((feed) => (
              <div key={feed.id} className="bg-dark-200 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{feed.name}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-3 break-all">{feed.url}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant={feed.isActive ? "default" : "secondary"}>
                    {feed.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    {feed.category}
                  </Badge>
                  {feed.lastUpdated && (
                    <Badge variant="outline" className="text-gray-400 border-gray-600">
                      Last updated: {new Date(feed.lastUpdated).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RssFeedManager;
