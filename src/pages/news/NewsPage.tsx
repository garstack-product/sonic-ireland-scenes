
import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ExternalLinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getNewsItems } from '@/services/newsService';

interface NewsItem {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  author?: string;
  date: string;
  category?: string;
  image_url?: string;
  tags?: string[];
  created_at: string;
  url?: string;
}

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewsItems = async () => {
      try {
        const data = await getNewsItems();
        setNewsItems(data);
      } catch (error) {
        console.error('Error loading news items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewsItems();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  // Sort news items by date (newest first)
  const sortedNewsItems = [...newsItems].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Check if an item is from RSS feed
  const isRssItem = (item: NewsItem) => {
    return item.tags?.includes('RSS Feed') && item.url;
  };

  // Handle card click
  const handleCardClick = (item: NewsItem) => {
    if (isRssItem(item) && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div>
      <PageHeader 
        title="News" 
        subtitle="The latest music news, announcements, and updates"
      />
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : sortedNewsItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No news items available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {sortedNewsItems.map((item) => (
            <Card 
              key={item.id} 
              className={`bg-dark-300 border-gray-700 hover:bg-dark-400 transition-colors h-full flex flex-col ${isRssItem(item) ? 'cursor-pointer' : ''}`}
              onClick={() => handleCardClick(item)}
            >
              <div className="aspect-video overflow-hidden rounded-t-lg flex-shrink-0">
                <img 
                  src={item.image_url || '/placeholder.svg'} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-center text-sm text-gray-400 space-x-4 mb-2">
                  <span className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(item.date)}
                  </span>
                  {item.category && item.category !== 'RSS Feed' && (
                    <span className="px-2 py-1 bg-dark-400 rounded text-xs">
                      {item.category}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl text-white line-clamp-3">{item.title}</CardTitle>
                {item.excerpt && (
                  <CardDescription className="text-gray-300 line-clamp-2">
                    {item.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-300 line-clamp-3">
                  {item.content}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-start mt-auto">
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.filter(tag => tag !== 'RSS Feed').map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-dark-500 text-gray-300 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {!isRssItem(item) && (
                  <Link 
                    to={`/news/${item.id}`} 
                    className="flex items-center text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read more
                    <ExternalLinkIcon className="ml-1 h-4 w-4" />
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
