
import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ExternalLinkIcon, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getNewsItems } from '@/services/newsService';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
  const [visibleItemCount, setVisibleItemCount] = useState(12);

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

  // Sort news items by created_at date (newest first) for proper chronological ordering
  const sortedNewsItems = [...newsItems].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA; // Most recent first
  });

  // Get displayed items based on visible count
  const displayedNewsItems = sortedNewsItems.slice(0, visibleItemCount);

  // Group items by month for dividers using created_at for consistency
  const groupedByMonth = displayedNewsItems.reduce((groups, item) => {
    const monthYear = format(new Date(item.created_at), 'MMMM yyyy');
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(item);
    return groups;
  }, {} as Record<string, NewsItem[]>);

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

  // Handle load more
  const handleLoadMore = () => {
    setVisibleItemCount(prevCount => prevCount + 12);
  };

  return (
    <div>
      <PageHeader 
        title="News" 
        subtitle="The latest music news, announcements, and updates"
      />
      
      <div className="mb-6 mt-4">
        <p className="text-gray-400">
          {isLoading ? "Loading news..." : `${sortedNewsItems.length} news items found`}
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : sortedNewsItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No news items available at the moment.</p>
        </div>
      ) : (
        <>
          {Object.entries(groupedByMonth).map(([monthYear, items], monthIndex) => (
            <div key={monthYear}>
              {monthIndex > 0 && (
                <div className="my-8 flex items-center">
                  <Separator className="flex-1" />
                  <div className="mx-4 text-sm text-gray-400 font-medium">
                    {monthYear}
                  </div>
                  <Separator className="flex-1" />
                </div>
              )}
              
              {monthIndex === 0 && (
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-medium text-gray-300">{monthYear}</h3>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {items.map((item) => (
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
            </div>
          ))}
          
          {displayedNewsItems.length < sortedNewsItems.length && (
            <div className="mt-8 flex justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleLoadMore}
                className="flex items-center gap-2"
              >
                View More <ChevronDown size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsPage;
