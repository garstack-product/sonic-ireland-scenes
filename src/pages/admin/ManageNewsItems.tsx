
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Edit, Trash2, Save, X } from "lucide-react";
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
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const startEditing = (item: NewsItem) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const saveEditedItem = async () => {
    if (!editingItem) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('news_items')
        .update({
          title: editingItem.title,
          content: editingItem.content,
          excerpt: editingItem.excerpt,
          author: editingItem.author,
          category: editingItem.category,
          image_url: editingItem.image_url,
          tags: editingItem.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      toast.success('News item updated successfully');
      setIsEditDialogOpen(false);
      setEditingItem(null);
      await loadNewsItems();
    } catch (error) {
      console.error('Error updating news item:', error);
      toast.error('Failed to update news item');
    } finally {
      setIsSaving(false);
    }
  };

  const updateEditingField = (field: keyof NewsItem, value: any) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
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
                      onClick={() => startEditing(item)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                    >
                      <Edit size={16} />
                    </Button>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-dark-300 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit News Item</DialogTitle>
            <DialogDescription className="text-gray-400">
              Make changes to your news item. You can re-publish or share after editing.
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <Input
                  value={editingItem.title}
                  onChange={(e) => updateEditingField('title', e.target.value)}
                  className="bg-dark-200 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt
                </label>
                <Textarea
                  value={editingItem.excerpt || ''}
                  onChange={(e) => updateEditingField('excerpt', e.target.value)}
                  className="bg-dark-200 border-gray-700 text-white min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content ({editingItem.content.split(' ').length} words)
                </label>
                <Textarea
                  value={editingItem.content}
                  onChange={(e) => updateEditingField('content', e.target.value)}
                  className="bg-dark-200 border-gray-700 text-white min-h-[300px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author
                  </label>
                  <Input
                    value={editingItem.author || ''}
                    onChange={(e) => updateEditingField('author', e.target.value)}
                    className="bg-dark-200 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <Input
                    value={editingItem.category || ''}
                    onChange={(e) => updateEditingField('category', e.target.value)}
                    className="bg-dark-200 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <Input
                  value={editingItem.image_url || ''}
                  onChange={(e) => updateEditingField('image_url', e.target.value)}
                  className="bg-dark-200 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <Input
                  value={editingItem.tags?.join(', ') || ''}
                  onChange={(e) => updateEditingField('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                  className="bg-dark-200 border-gray-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSaving}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={saveEditedItem}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageNewsItems;
